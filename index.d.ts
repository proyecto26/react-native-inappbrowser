declare module 'react-native-inappbrowser-reborn' {
  export interface BrowserResult {
    type: 'cancel' | 'dismiss';
  }

  export interface RedirectEvent {
    url: 'string';
  }

  export interface RedirectResult {
    type: 'success';
    url: string;
  }

  export interface InAppBrowserOptions {
    dismissButtonStyle?: 'done' | 'close' | 'cancel';
    preferredBarTintColor?: string;
    preferredControlTintColor?: string;
    toolbarColor?: string;
    enableUrlBarHiding?: boolean;
    showTitle?: boolean;
    enableDefaultShare?: boolean;
    forceCloseOnRedirection?: boolean;
    readerMode?: boolean;
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
