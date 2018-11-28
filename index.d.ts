declare module 'react-native-inappbrowser-reborn' {
  export interface RedirectEvent {
    url: 'string';
  }

  export interface BrowserResult {
    type: 'cancel' | 'dismiss';
  }

  export interface RedirectResult {
    type: 'success';
    url: string;
  }

  export interface InAppBrowserOptions {
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

  type AuthSessionResult = RedirectResult | BrowserResult;

  interface RNInAppBrowserClassMethods {
    open: (
      url: string,
      options?: InAppBrowserOptions,
    ) => Promise<BrowserResult>;
    close: () => void;
    openAuth: (
      url: string,
      redirectUrl: string,
      options?: InAppBrowserOptions,
    ) => Promise<AuthSessionResult>;
    closeAuth: () => void;
    isAvailable: () => Promise<void>;
  }

  const RNInAppBrowser: RNInAppBrowserClassMethods;

  export default RNInAppBrowser;
}
