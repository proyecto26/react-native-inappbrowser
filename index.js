// @flow

import invariant from 'invariant';
import { Linking, NativeModules, Platform, processColor } from 'react-native';

const { RNInAppBrowser } = NativeModules;

type RedirectEvent = {
  url: 'string'
};

type BrowserResult = {
  type: 'cancel' | 'dismiss'
};

type RedirectResult = {
  type: 'success',
  url: string
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
  enableBarCollapsing?: boolean
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
    endExit: string
  },
  headers?: { [key: string]: string }
};

type InAppBrowserOptions = InAppBrowserAndroidOptions | InAppBrowseriOSOptions;

async function open(
  url: string,
  options: InAppBrowserOptions = {}
): Promise<BrowserResult> {
  const {
    animated,
    readerMode,
    modalEnabled,
    dismissButtonStyle,
    enableBarCollapsing,
    preferredBarTintColor,
    preferredControlTintColor,
    ...optionalOptions
  } = options;
  const inAppBrowserOptions = {
    ...optionalOptions,
    url,
    dismissButtonStyle: dismissButtonStyle || 'close',
    readerMode: !!readerMode,
    animated: animated !== undefined ? animated : true,
    modalEnabled: modalEnabled !== undefined ? modalEnabled : true,
    enableBarCollapsing: !!enableBarCollapsing,
    preferredBarTintColor:
      preferredBarTintColor && processColor(preferredBarTintColor),
    preferredControlTintColor:
      preferredControlTintColor && processColor(preferredControlTintColor)
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
  if (_authSessionIsNativelySupported()) {
    return RNInAppBrowser.openAuth(url, redirectUrl);
  } else {
    return _openAuthSessionPolyfillAsync(url, redirectUrl, options);
  }
}

function closeAuth(): void {
  if (_authSessionIsNativelySupported()) {
    RNInAppBrowser.closeAuth();
  } else {
    RNInAppBrowser.close();
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
      open(startUrl, options).then(function(result) {
        return _checkResultAndReturnUrl(returnUrl, result);
      })
    ]);
  } finally {
    close();
    Linking.removeEventListener('url', _redirectHandler);
    _redirectHandler = null;
  }
  return response;
}

function _waitForRedirectAsync(returnUrl: string): Promise<RedirectResult> {
  return new Promise(resolve => {
    _redirectHandler = (event: RedirectEvent) => {
      if (event.url.startsWith(returnUrl)) {
        resolve({ url: event.url, type: 'success' });
      }
    };

    Linking.addEventListener('url', _redirectHandler);
  });
}

function _checkResultAndReturnUrl(
  returnUrl: string,
  result: RedirectResult
): Promise<RedirectResult> {
  return new Promise(function(resolve) {
    Linking.getInitialURL()
      .then(function(url) {
        if (url && url.startsWith(returnUrl)) {
          resolve({ url: url, type: 'success' });
        } else {
          resolve(result);
        }
      })
      .catch(function() {
        resolve(result);
      });
  });
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
  isAvailable
};
