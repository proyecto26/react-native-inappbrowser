<p align="center">
  <a href="./LICENSE">
    <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license" />
  </a>
  <a href="https://npmjs.org/package/react-native-inappbrowser-reborn">
    <img src="http://img.shields.io/npm/v/react-native-inappbrowser-reborn.svg" alt="Current npm package version" />
  </a>
  <a href="https://github.com/proyecto26/react-native-inappbrowser/graphs/commit-activity">
    <img src="https://img.shields.io/badge/Maintained%3F-yes-brightgreen.svg" alt="Maintenance" />
  </a>
  <a href="https://tidelift.com/subscription/pkg/npm-react-native-inappbrowser-reborn?utm_source=npm-react-native-inappbrowser-reborn&utm_medium=referral&utm_campaign=readme">
    <img src="https://tidelift.com/badges/package/npm/react-native-inappbrowser-reborn" alt="Tidelift Subscription" />
  </a>
  <a href="https://opencollective.com/proyecto26" alt="Financial Contributors on Open Collective">
    <img src="https://opencollective.com/proyecto26/all/badge.svg?label=financial+contributors" />
  </a>
  <a href="https://npmjs.org/package/react-native-inappbrowser-reborn">
    <img src="http://img.shields.io/npm/dm/react-native-inappbrowser-reborn.svg" alt="Downloads" />
  </a>
  <a href="https://npmjs.org/package/react-native-inappbrowser-reborn">
    <img src="http://img.shields.io/npm/dt/react-native-inappbrowser-reborn.svg?label=total%20downloads" alt="Total downloads" />
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=jdnichollsc">
    <img src="https://img.shields.io/twitter/follow/jdnichollsc.svg?label=Follow%20@jdnichollsc" alt="Follow @jdnichollsc" />
  </a>
</p>

<h1 align="center">InAppBrowser for React Native</h1>
<h4 align="center"><a href="https://developer.chrome.com/multidevice/android/customtabs#whatarethey">Chrome Custom Tabs</a> for Android & <a href="https://developer.apple.com/documentation/safariservices">SafariServices</a>/<a href="https://developer.apple.com/documentation/authenticationservices">AuthenticationServices</a> for iOS.</h4>

<p align="center">
  <img width="400px" src="img/inappbrowser.png">
</p>

## Getting started

`$ npm install react-native-inappbrowser-reborn --save`

### Mostly automatic installation

#### Using React Native >= 0.60
Linking the package manually is not required anymore with [Autolinking](https://github.com/react-native-community/cli/blob/master/docs/autolinking.md).

- **iOS Platform:**

  `$ cd ios && pod install && cd ..` # CocoaPods on iOS needs this extra step

- **Android Platform with Android Support:**

  Using [Jetifier tool](https://github.com/mikehardy/jetifier) for backward-compatibility.

  Modify your **android/build.gradle** configuration:
  ```
  buildscript {
    ext {
      buildToolsVersion = "28.0.3"
      minSdkVersion = 16
      compileSdkVersion = 28
      targetSdkVersion = 28
      # Only using Android Support libraries
      supportLibVersion = "28.0.0"
    }
  ```

- **Android Platform with AndroidX:**

  Modify your **android/build.gradle** configuration:
  ```
  buildscript {
    ext {
      buildToolsVersion = "28.0.3"
      minSdkVersion = 16
      compileSdkVersion = 28
      targetSdkVersion = 28
      # Remove 'supportLibVersion' property and put specific versions for AndroidX libraries
      androidXAnnotation = "1.1.0"
      androidXBrowser = "1.0.0"
      // Put here other AndroidX dependencies
    }
  ```

#### Using React Native < 0.60

`$ react-native link react-native-inappbrowser-reborn`

### Manual installation

#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-inappbrowser-reborn` and add `RNInAppBrowser.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNInAppBrowser.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### iOS with Podfile
1. Open up `ios/Podfile`
  - Add `pod 'RNInAppBrowser', :path => '../node_modules/react-native-inappbrowser-reborn'`
2. Run `pod install`

#### Android

1. Open up `android/app/src/main/java/[...]/MainApplication.java`
  - Add `import com.proyecto26.inappbrowser.RNInAppBrowserPackage;` to the imports at the top of the file
  - Add `new RNInAppBrowserPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-inappbrowser-reborn'
  	project(':react-native-inappbrowser-reborn').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-inappbrowser-reborn/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      implementation project(':react-native-inappbrowser-reborn')
  	```
4. Update ProGuard config (Optional)
  - Append the following lines to your ProGuard config (`proguard-rules.pro`)
    ```
    -keepattributes *Annotation*
    -keepclassmembers class ** {
      @org.greenrobot.eventbus.Subscribe <methods>;
    }
    -keep enum org.greenrobot.eventbus.ThreadMode { *; }
    ```

## Usage

Methods       | Action
------------- | ------
`open`        | Opens the url with Safari in a modal on iOS using **SFSafariViewController**, and Chrome in a new custom tab on Android. On iOS, the modal Safari will not share cookies with the system Safari.
`close`       | Dismisses the system's presented web browser.
`openAuth`    | Opens the url with Safari in a modal on iOS using **SFAuthenticationSession/ASWebAuthenticationSession**, and Chrome in a new custom tab on Android. On iOS, the user will be asked whether to allow the app to authenticate using the given url **(OAuth flow with deep linking redirection)**.
`closeAuth`   | Dismisses the current authentication session.
`isAvailable` | Detect if the device supports this plugin.

### iOS Options

Property       | Description
-------------- | ------
`dismissButtonStyle` (String)        | The style of the dismiss button. [`done`/`close`/`cancel`]
`preferredBarTintColor` (String)     | The color to tint the background of the navigation bar and the toolbar. [`white`/`#FFFFFF`]
`preferredControlTintColor` (String) | The color to tint the control buttons on the navigation bar and the toolbar. [`gray`/`#808080`]
`readerMode` (Boolean)               | A value that specifies whether Safari should enter Reader mode, if it is available. [`true`/`false`]
`animated` (Boolean)                 | Animate the presentation. [`true`/`false`]
`modalPresentationStyle` (String)    | The presentation style for modally presented view controllers. [`automatic`/`none`/`fullScreen`/`pageSheet`/`formSheet`/`currentContext`/`custom`/`overFullScreen`/`overCurrentContext`/`popover`]
`modalTransitionStyle` (String)      | The transition style to use when presenting the view controller. [`coverVertical`/`flipHorizontal`/`crossDissolve`/`partialCurl`]
`modalEnabled` (Boolean)             | Present the **SafariViewController** modally or as push instead. [`true`/`false`]
`enableBarCollapsing` (Boolean)      | Determines whether the browser's tool bars will collapse or not. [`true`/`false`]
`ephemeralWebSession` (Boolean)      | Prevent re-use cookies of previous session (openAuth only) [`true`/`false`]

### Android Options
Property       | Description
-------------- | ------
`showTitle` (Boolean)   | Sets whether the title should be shown in the custom tab. [`true`/`false`]
`toolbarColor` (String)           | Sets the toolbar color. [`gray`/`#808080`]
`secondaryToolbarColor` (String)  | Sets the color of the secondary toolbar. [`white`/`#FFFFFF`]
`enableUrlBarHiding` (Boolean)    | Enables the url bar to hide as the user scrolls down on the page. [`true`/`false`]
`enableDefaultShare` (Boolean)    | Adds a default share item to the menu. [`true`/`false`]
`animations` (Object)             | Sets the start and exit animations. [`{ startEnter, startExit, endEnter, endExit }`]
`headers` (Object)                | The data are key/value pairs, they will be sent in the HTTP request headers for the provided url. [`{ 'Authorization': 'Bearer ...' }`]
`forceCloseOnRedirection` (Boolean) | Open Custom Tab in a new task to avoid issues redirecting back to app scheme. [`true`/`false`]

### Demo

```javascript
import { Linking } from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'

...
  async openLink() {
    try {
      const url = 'https://www.google.com'
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#453AA4',
          preferredControlTintColor: 'white',
          readerMode: false,
          animated: true,
          modalPresentationStyle: 'overFullScreen',
          modalTransitionStyle: 'partialCurl',
          modalEnabled: true,
          enableBarCollapsing: false,
          // Android Properties
          showTitle: true,
          toolbarColor: '#6200EE',
          secondaryToolbarColor: 'black',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          // Specify full animation resource identifier(package:anim/name)
          // or only resource name(in case of animation bundled with app).
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right'
          },
          headers: {
            'my-custom-header': 'my custom header value'
          }
        })
        Alert.alert(JSON.stringify(result))
      }
      else Linking.openURL(url)
    } catch (error) {
      Alert.alert(error.message)
    }
  }
...
```

### Authentication Flow using Deep Linking

In order to redirect back to your application from a web browser, you must specify a unique URI to your app. To do this,
define your app scheme and replace `my-scheme` and `my-host` with your info.

- Enable deep linking (Android) - **[AndroidManifest.xml](https://github.com/proyecto26/react-native-inappbrowser/blob/master/example/android/app/src/main/AndroidManifest.xml#L23)**
```
<intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="my-scheme" android:host="my-host" android:pathPrefix="" />
</intent-filter>
```

- Enable deep linking (iOS) - **[Info.plist](https://github.com/proyecto26/react-native-inappbrowser/blob/master/example/ios/example/Info.plist#L23)**
```
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleTypeRole</key>
    <string>Editor</string>
    <key>CFBundleURLName</key>
    <string>my-scheme</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>my-scheme</string>
    </array>
  </dict>
</array>
```

- utilities.js
```javascript
import { Platform } from 'react-native'
export const getDeepLink = (path = "") => {
  const scheme = 'my-scheme'
  const prefix = Platform.OS == 'android' ? `${scheme}://my-host/` : `${scheme}://`
  return prefix + path
}
```
- App.js ([Using react-navigation with Deep Linking](https://reactnavigation.org/docs/en/deep-linking.html))
```javascript
import { Root } from 'native-base'
import { getDeepLink } from './utilities'
import { createStackNavigator } from 'react-navigation'

const Main = createStackNavigator(
  {
    SplashComponent: { screen: SplashComponent },
    LoginComponent: { screen: LoginComponent },
    HomeComponent: { screen: HomeComponent },
    CallbackComponent: { //Redirect users to the Home page if they are authenticated, otherwise to Login page...
      screen: CallbackComponent,
      path: 'callback/' //Enable Deep linking redirection to get the auth_token
    }
  },
  {
    index: 0,
    initialRouteName: 'SplashComponent',
    headerMode: 'none'
  }
)
...
  render() {
    return (
      <Root>
        <Main uriPrefix={getDeepLink()} />
      </Root>
    )
  }
...
```

- LoginComponent
```javascript
import { Linking } from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'
import { getDeepLink } from './utilities'
...
  async onLogin() {
    const deepLink = getDeepLink("callback")
    const url = `https://my-auth-login-page.com?redirect_uri=${deepLink}`
    try {
      if (await InAppBrowser.isAvailable()) {
        InAppBrowser.openAuth(url, deepLink, {
          // iOS Properties
          ephemeralWebSession: false,
          // Android Properties
          showTitle: false,
          enableUrlBarHiding: true,
          enableDefaultShare: false
        }).then((response) => {
          if (
            response.type === 'success' &&
            response.url
          ) {
            Linking.openURL(response.url)
          }
        })
      } else Linking.openURL(url)
    } catch (error) {
      Linking.openURL(url)
    }
  }
...
```

- SplashComponent
```javascript
...
  async componentDidMount() {
    // Play Lottie Animation :)
    
    // Validate the stored access token (Maybe with a request)
    // Redirect the user to the Home page if the token is still valid
    // Otherwise redirect to the Login page
  }
...
```

- CallbackComponent
```javascript
...
  async componentDidMount() {
    // Play Lottie Animation :)
    try {
      await this.loadUserInfo()
      // Redirect to the Home page
    } catch (error) {
      // Show error and redirect the user to the Login page
    }
  }
  
  async loadUserInfo() {
    const { navigation } = this.props
    const { state: { params } } = navigation
    const { code, error } = params || {}

    if (code) {
      // Get and Save the access token request, user info...
    }
    else {
      return Promise.reject(new Error(error))
    }
  }
...
```

### StatusBar

The StatusBar will keep the last one provided in your app. So if the StatusBar is `dark-content` before you open the browser this will keep it.

Starting with React Native 0.59 onwards, there is a simpler way of handling this update, without the need of patching StatusBar.
```javascript
  async openInBrowser(url) {
    try {
      const oldStyle = StatusBar.pushStackEntry({ barStyle: 'dark-content', animate: false });
      await InAppBrowser.open(url)
      StatusBar.popStackEntry(oldStyle);
    } catch (error) {
      Alert.alert(error.message)
    }
  })
```

For previous versions, you can still apply the method described below.

If you want to change before opening you can do something like

```javascript
  async openInBrowser(url) {
    try {
      StatusBar.setBarStyle('dark-content')
      await InAppBrowser.open(url)
    } catch (error) {
      Alert.alert(error.message)
    }
  })
```

If you need to restore the old bar style, after the browser is dismissed, you can try and patch the StatusBar.setBarStyle function to store the old value like so:

```js
// patch StatusBar.setBarStyle to make style accessible
const _setBarStyle = StatusBar.setBarStyle
StatusBar.setBarStyle = (style) => {
  StatusBar.currentStyle = style
  _setBarStyle(style)
}
```

You can than restore the old bar style after the browser has been dismissed like this:

```javascript
  async openInBrowser(url) {
    try {
      const oldStyle = StatusBar.currentStyle
      StatusBar.setBarStyle('dark-content')
      await InAppBrowser.open(url)
      if(oldStyle) StatusBar.setBarStyle(oldStyle)
    } catch (error) {
      Alert.alert(error.message)
    }
  })
```

### Authentication

Using in-app browser tabs (like SFAuthenticationSession/ASWebAuthenticationSession and Android Custom Tabs) where available. Embedded user-agents, known as web-views (like UIWebView and WKWebView), are explicitly not supported due to the usability and security reasons documented in [Section 8.12 of RFC 8252](https://tools.ietf.org/html/rfc8252#section-8.12).

## Credits 👍
* **Expo:** [WebBrowser](https://docs.expo.io/versions/latest/sdk/webbrowser)
* **React Native Custom Tabs:** [Chrome Custom Tabs for React Native](https://github.com/droibit/react-native-custom-tabs)
* **React Native Safari View:** [A React Native wrapper for Safari View Controller](https://github.com/naoufal/react-native-safari-view)

## Contributors ✨
Please do contribute! Issues and pull requests are welcome.

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
<a href="https://github.com/proyecto26/react-native-inappbrowser/graphs/contributors"><img src="https://opencollective.com/proyecto26/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/proyecto26/contribute)]

#### Individuals

<a href="https://opencollective.com/proyecto26"><img src="https://opencollective.com/proyecto26/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/proyecto26/contribute)]

<a href="https://opencollective.com/proyecto26/organization/0/website"><img src="https://opencollective.com/proyecto26/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/proyecto26/organization/1/website"><img src="https://opencollective.com/proyecto26/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/proyecto26/organization/2/website"><img src="https://opencollective.com/proyecto26/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/proyecto26/organization/3/website"><img src="https://opencollective.com/proyecto26/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/proyecto26/organization/4/website"><img src="https://opencollective.com/proyecto26/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/proyecto26/organization/5/website"><img src="https://opencollective.com/proyecto26/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/proyecto26/organization/6/website"><img src="https://opencollective.com/proyecto26/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/proyecto26/organization/7/website"><img src="https://opencollective.com/proyecto26/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/proyecto26/organization/8/website"><img src="https://opencollective.com/proyecto26/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/proyecto26/organization/9/website"><img src="https://opencollective.com/proyecto26/organization/9/avatar.svg"></a>

## Supporting 🍻
I believe in Unicorns 🦄
Support [me](http://www.paypal.me/jdnichollsc/2), if you do too.
[Professionally supported react-native-inappbrowser-reborn is coming soon](https://tidelift.com/subscription/pkg/npm-react-native-inappbrowser-reborn?utm_source=npm-react-native-inappbrowser-reborn&utm_medium=referral&utm_campaign=readme)

## Security contact information 🚨
To report a security vulnerability, please use the [Tidelift security contact](https://tidelift.com/security). Tidelift will coordinate the fix and disclosure.

## Happy coding 💯
Made with ❤️

<img width="150px" src="https://avatars0.githubusercontent.com/u/28855608?s=200&v=4" align="right">
