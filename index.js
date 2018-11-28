// @flow

import invariant from 'invariant'
import { Linking, NativeModules, Platform, processColor } from 'react-native'

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

type InAppBrowserOptions = {
  dismissButtonStyle?: 'done' | 'close' | 'cancel',
  preferredBarTintColor?: string,
  preferredControlTintColor?: string,
  readerMode?: boolean,
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
  headers?: { [string]: string }
}

async function open(url: string, options: InAppBrowserOptions = {}): Promise<BrowserResult> {
  const inAppBrowseroptions = {
    ...options,
    url,
    dismissButtonStyle: options.dismissButtonStyle || 'close',
    readerMode: options.readerMode !== undefined ? options.readerMode : false
  }
  if (inAppBrowseroptions.preferredBarTintColor) {
    inAppBrowseroptions.preferredBarTintColor = processColor(inAppBrowseroptions.preferredBarTintColor)
  }
  if (inAppBrowseroptions.preferredControlTintColor) {
    inAppBrowseroptions.preferredControlTintColor = processColor(inAppBrowseroptions.preferredControlTintColor)
  }
  return RNInAppBrowser.open(inAppBrowseroptions);
}

function close(): void {
  RNInAppBrowser.close();
}

type AuthSessionResult = RedirectResult | BrowserResult;

async function openAuth(url: string, redirectUrl: string, options: InAppBrowserOptions = {}): Promise<AuthSessionResult> {
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

  try {
    return await Promise.race([open(startUrl, options), _waitForRedirectAsync(returnUrl)]);
  } finally {
    close();
    Linking.removeEventListener('url', _redirectHandler);
    _redirectHandler = null;
  }
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

async function isAvailable(): Promise<void> {
  if (Platform.OS === 'android') {
    return Promise.resolve();
  }
  else {
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
