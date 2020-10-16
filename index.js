/**
 * InAppBrowser for React Native
 * https://github.com/proyecto26/react-native-inappbrowser
 *
 * @format
 * @flow strict-local
 */

import type {
  BrowserResult,
  AuthSessionResult,
  InAppBrowserOptions,
} from './types';
import {
  RNInAppBrowser,
  openBrowserAsync,
  openAuthSessionAsync,
  openAuthSessionPolyfillAsync,
  closeAuthSessionPolyfillAsync,
  authSessionIsNativelySupported,
} from './utils';

async function open(
  url: string,
  options?: InAppBrowserOptions
): Promise<BrowserResult> {
  return openBrowserAsync(url, options);
}

async function openAuth(
  url: string,
  redirectUrl: string,
  options?: InAppBrowserOptions
): Promise<AuthSessionResult> {
  if (authSessionIsNativelySupported()) {
    return openAuthSessionAsync(url, redirectUrl, options);
  } else {
    return openAuthSessionPolyfillAsync(url, redirectUrl, options);
  }
}

function close(): void {
  RNInAppBrowser.close();
}

function closeAuth(): void {
  closeAuthSessionPolyfillAsync();
  if (authSessionIsNativelySupported()) {
    RNInAppBrowser.closeAuth();
  } else {
    close();
  }
}

async function isAvailable(): Promise<boolean> {
  return RNInAppBrowser.isAvailable();
}

export const InAppBrowser = {
  open,
  openAuth,
  close,
  closeAuth,
  isAvailable,
};

export default InAppBrowser;
