/**
 * @format
 * @flow strict-local
 */

import invariant from 'invariant';
import {
  processColor,
  Linking,
  Platform,
  AppState,
  NativeModules
} from 'react-native';
import type {
  BrowserResult,
  RedirectEvent,
  RedirectResult,
  AuthSessionResult,
  InAppBrowserOptions
} from './types';

export const RNInAppBrowser = NativeModules.RNInAppBrowser;

let _redirectHandler: ?(event: RedirectEvent) => void;

type AppStateStatus = typeof AppState.currentState

function waitForRedirectAsync(returnUrl: string): Promise<RedirectResult> {
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
function handleAppStateActiveOnce(): Promise<void> {
  return new Promise(function (resolve) {
    // Browser can be closed before handling AppState change
    if (AppState.currentState === 'active') {
      return resolve();
    }
    function handleAppStateChange(nextAppState: AppStateStatus) {
      if (nextAppState === 'active') {
        AppState.removeEventListener('change', handleAppStateChange);
        resolve();
      }
    }
    AppState.addEventListener('change', handleAppStateChange);
  });
}

async function checkResultAndReturnUrl(
  returnUrl: string,
  result: AuthSessionResult
): Promise<AuthSessionResult> {
  if (Platform.OS === 'android' && result.type !== 'cancel') {
    try {
      await handleAppStateActiveOnce();
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

export async function openBrowserAsync(
  url: string,
  options?: InAppBrowserOptions = {
    animated: true,
    modalEnabled: true,
    dismissButtonStyle: 'close',
    readerMode: false,
    enableBarCollapsing: false
  }
): Promise<BrowserResult> {
  return RNInAppBrowser.open({
    ...options,
    url,
    preferredBarTintColor:
      options.preferredBarTintColor &&
      processColor(options.preferredBarTintColor),
    preferredControlTintColor:
      options.preferredControlTintColor &&
      processColor(options.preferredControlTintColor)
  })
}

export async function openAuthSessionAsync(
  url: string,
  redirectUrl: string,
  options?: InAppBrowserOptions = {
    ephemeralWebSession: false
  }
): Promise<AuthSessionResult> {
  return RNInAppBrowser.openAuth(
    url,
    redirectUrl,
    options
  );
}

export async function openAuthSessionPolyfillAsync(
  startUrl: string,
  returnUrl: string,
  options?: InAppBrowserOptions
): Promise<AuthSessionResult> {
  invariant(
    !_redirectHandler,
    'InAppBrowser.openAuth is in a bad state. _redirectHandler is defined when it should not be.'
  );
  let response = null;
  try {
    response = await Promise.race([
      waitForRedirectAsync(returnUrl),
      openBrowserAsync(startUrl, options).then(function (result) {
        return checkResultAndReturnUrl(returnUrl, result);
      }),
    ]);
  } finally {
    closeAuthSessionPolyfillAsync();
    RNInAppBrowser.close();
  }
  return response;
}

export function closeAuthSessionPolyfillAsync(): void {
  if (_redirectHandler) {
    Linking.removeEventListener('url', _redirectHandler);
    _redirectHandler = null;
  }
}

/* iOS <= 10 and Android polyfill for SFAuthenticationSession flow */
export function authSessionIsNativelySupported(): boolean {
  if (Platform.OS === 'android') {
    return false;
  }

  const versionNumber = parseInt(Platform.Version, 10);
  return versionNumber >= 11;
}
