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
    ephemeralWebSession?: boolean
  }

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
  }

  export type InAppBrowserOptions = InAppBrowserAndroidOptions | InAppBrowseriOSOptions;

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
    isAvailable: () => Promise<boolean>;
  }

  const RNInAppBrowser: RNInAppBrowserClassMethods;

  export default RNInAppBrowser;
}
