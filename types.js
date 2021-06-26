/**
 * @format
 * @flow strict-local
 */

export type RedirectEvent = {|
  url: 'string',
|};

export type BrowserResult = {|
  type: 'cancel' | 'dismiss',
|};

export type RedirectResult = {|
  type: 'success',
  url: string,
|};

type InAppBrowseriOSOptions = {|
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
|};

type InAppBrowserAndroidOptions = {|
  showTitle?: boolean,
  toolbarColor?: string,
  secondaryToolbarColor?: string,
  navigationBarColor?: string,
  navigationBarDividerColor?: string,
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
  hasBackButton?: boolean,
  browserPackage?: string,
  showInRecents?: boolean,
|};

export type InAppBrowserOptions = {
  ...InAppBrowserAndroidOptions,
  ...InAppBrowseriOSOptions
};

export type AuthSessionResult = RedirectResult | BrowserResult;
