/**
 * InAppBrowser for React Native
 * https://github.com/proyecto26/react-native-inappbrowser
 *
 * @format
 * @flow strict-local
 */

import invariant from 'invariant';
import {
  Linking,
  NativeModules,
  Platform,
  processColor,
  AppState,
  AppStateStatus,
} from 'react-native';

const { RNInAppBrowser } = NativeModules;

type RedirectEvent = {
  url: 'string',
};

type BrowserResult = {
  type: 'cancel' | 'dismiss',
};

type RedirectResult = {
  type: 'success',
  url: string,
};

type InAppBrowseriOSOptions = {
  dismissButtonStyle?: 'done' | 'close' | 'cancel',
  preferredBarTintColor?: string,
  preferredControlTintColor?: string,
  readerMode?: boolean,
  animated?: boolean,
  modalPresentationStyle?:
    | 'automatic'
    | 'fullScreen'
    | 'pageSheet'
    | 'formSheet'
    | 'currentContext'
    | 'custom'
    | 'overFullScreen'
    | 'overCurrentContext'
    | 'popover'
    | 'none',
  modalTransitionStyle?:
    | 'coverVertical'
    | 'flipHorizontal'
    | 'crossDissolve'
    | 'partialCurl',
  modalEnabled?: boolean,
  enableBarCollapsing?: boolean,
  ephemeralWebSession?: boolean,
};

type InAppBrowserAndroidOptions = {
  showTitle?: boolean,
  toolbarColor?: string,
  secondaryToolbarColor?: string,
  enableUrlBarHiding?: boolean,
  enableDefaultShare?: boolean,
  forceCloseOnRedirection?: boolean,
  animations?: {
    startEnter: string,
    startExit: string,
    endEnter: string,
    endExit: string,
  },
  headers?: { [key: string]: string },
};

type InAppBrowserOptions = InAppBrowserAndroidOptions | InAppBrowseriOSOptions;

async function open(
  url: string,
  options: InAppBrowserOptions = {}
): Promise<BrowserResult> {
  const inAppBrowserOptions = {
    ...options,
    url,
    dismissButtonStyle: options.dismissButtonStyle || 'close',
    readerMode: !!options.readerMode,
    animated: options.animated !== undefined ? options.animated : true,
    modalEnabled:
      options.modalEnabled !== undefined ? options.modalEnabled : true,
    enableBarCollapsing: !!options.enableBarCollapsing,
    preferredBarTintColor:
      options.preferredBarTintColor &&
      processColor(options.preferredBarTintColor),
    preferredControlTintColor:
      options.preferredControlTintColor &&
      processColor(options.preferredControlTintColor),
  };
  return RNInAppBrowser.open(inAppBrowserOptions);
}

function close(): void {
  RNInAppBrowser.close();
}

type AuthSessionResult = RedirectResult | BrowserResult;

async function openAuth(
  url: string,
  redirectUrl: string,
  options: InAppBrowserOptions = {}
): Promise<AuthSessionResult> {
  const inAppBrowserOptions = {
    ...options,
    ephemeralWebSession:
      options.ephemeralWebSession !== undefined
        ? options.ephemeralWebSession
        : false,
  };

  if (_authSessionIsNativelySupported()) {
    return RNInAppBrowser.openAuth(url, redirectUrl, inAppBrowserOptions);
  } else {
    return _openAuthSessionPolyfillAsync(url, redirectUrl, inAppBrowserOptions);
  }
}

function closeAuth(): void {
  closeAuthSessionPolyfillAsync();
  if (_authSessionIsNativelySupported()) {
    RNInAppBrowser.closeAuth();
  } else {
    close();
  }
}

/* iOS <= 10 and Android polyfill for SFAuthenticationSession flow */
function _authSessionIsNativelySupported() {
  if (Platform.OS === 'android') {
    return false;
  }

  const versionNumber = parseInt(Platform.Version, 10);
  return versionNumber >= 11;
}

let _redirectHandler: ?(event: RedirectEvent) => void;

function closeAuthSessionPolyfillAsync(): void {
  if (_redirectHandler) {
    Linking.removeEventListener('url', _redirectHandler);
    _redirectHandler = null;
  }
}

async function _openAuthSessionPolyfillAsync(
  startUrl: string,
  returnUrl: string,
  options: InAppBrowserOptions
): Promise<AuthSessionResult> {
  invariant(
    !_redirectHandler,
    'InAppBrowser.openAuth is in a bad state. _redirectHandler is defined when it should not be.'
  );
  let response = null;
  try {
    response = await Promise.race([
      _waitForRedirectAsync(returnUrl),
      open(startUrl, options).then(function (result) {
        return _checkResultAndReturnUrl(returnUrl, result);
      }),
    ]);
  } finally {
    closeAuthSessionPolyfillAsync();
    close();
  }
  return response;
}

function _waitForRedirectAsync(returnUrl: string): Promise<RedirectResult> {
  return new Promise(function (resolve) {
    _redirectHandler = (event: RedirectEvent) => {
      if (event.url && event.url.startsWith(returnUrl)) {
        resolve({ url: event.url, type: 'success' });
      }
    };

    Linking.addEventListener('url', _redirectHandler);
  });
}

/**
 * Detect Android Activity `OnResume` event once
 */
function AppStateActiveOnce(): Promise<void> {
  return new Promise(function (resolve) {
    function _handleAppStateChange(nextAppState: AppStateStatus) {
      if (nextAppState === 'active') {
        AppState.removeEventListener('change', _handleAppStateChange);
        resolve();
      }
    }
    AppState.addEventListener('change', _handleAppStateChange);
  });
}

async function _checkResultAndReturnUrl(
  returnUrl: string,
  result: AuthSessionResult
): Promise<AuthSessionResult> {
  if (Platform.OS === 'android' && result.type !== 'cancel') {
    try {
      await AppStateActiveOnce();
      const url = await Linking.getInitialURL();
      return url && url.startsWith(returnUrl)
        ? { url, type: 'success' }
        : result;
    } catch {
      return result;
    }
  } else {
    return result;
  }
}

async function isAvailable(): Promise<boolean> {
  if (Platform.OS === 'android') {
    return Promise.resolve(true);
  } else {
    return RNInAppBrowser.isAvailable();
  }
}

export default {
  open,
  openAuth,
  close,
  closeAuth,
  isAvailable,
};
