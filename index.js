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
  isAndroid,
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

function warmup(): Promise<boolean> {
  if (isAndroid) {
    return RNInAppBrowser.warmup();
  }
  return Promise.resolve(false);
}

function mayLaunchUrl(
  mostLikelyUrl: string,
  otherUrls: Array<string> = []
): void {
  if (isAndroid) {
    RNInAppBrowser.mayLaunchUrl(mostLikelyUrl, otherUrls);
  }
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
  warmup,
  mayLaunchUrl,
};

export default InAppBrowser;
