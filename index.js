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
  modalEnabled?: boolean
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
  headers?: { [key: string]: string },
  waitForRedirectDelay?: number
};

type InAppBrowserOptions = InAppBrowserAndroidOptions | InAppBrowseriOSOptions;

async function open(
  url: string,
  options: InAppBrowserOptions = {}
): Promise<BrowserResult> {
  const modalEnabled =
    options.modalEnabled !== undefined ? options.modalEnabled : true;
  const inAppBrowserOptions = {
    ...options,
    url,
    dismissButtonStyle: options.dismissButtonStyle || 'close',
    readerMode: options.readerMode !== undefined ? options.readerMode : false,
    animated: options.animated !== undefined ? options.animated : true,
    modalEnabled,
    waitForRedirectDelay: options.waitForRedirectDelay || 0
  };
  if (inAppBrowserOptions.preferredBarTintColor) {
    inAppBrowserOptions.preferredBarTintColor = processColor(
      inAppBrowserOptions.preferredBarTintColor
    );
  }
  if (inAppBrowserOptions.preferredControlTintColor) {
    inAppBrowserOptions.preferredControlTintColor = processColor(
      inAppBrowserOptions.preferredControlTintColor
    );
  }
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
      open(startUrl, options).then(result => {
        return new Promise(resolve => {
          // A delay to wait for the redirection or dismiss the browser instead
          setTimeout(() => resolve(result), options.waitForRedirectDelay);
        });
      }),
      _waitForRedirectAsync(returnUrl)
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

async function isAvailable(): Promise<boolean> {
  return RNInAppBrowser.isAvailable();
}

export default {
  open,
  openAuth,
  close,
  closeAuth,
  isAvailable
};
