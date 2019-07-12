# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

<!-- TODO: Add new releases in the following format
## [new tag] - tag date
### Added 
for new features.
### Changed
for changes in existing functionality.
### Deprecated
for soon-to-be removed features.
### Removed
for now removed features.
### Fixed
for any bug fixes.
### Security 
in case of vulnerabilities.
-->

## [Unreleased]
### Added
- **Android:** Migrate to Android X by [@jdnichollsc](https://github.com/jdnichollsc).
- Start following [SemVer](https://semver.org) with git tags properly 😅.
- Included a **CHANGELOG** to see the history of the changes of the project.

### Removed
- **com.facebook.infer.annotation** dependency is not required anymore to buid for **Android**.

### BREAKING CHANGES

- **Android:** You are required to only use either the Support Library or AndroidX for your dependencies. If you need to migrate this library back to the support library, or another library forward to AndroidX, then take a look at the [Jetifier tool](https://github.com/mikehardy/jetifier).

## [2.0.4] - 2019-05-16
### Added
- README now contains a badges section
- Include deep linking example with `demo` schemes, redirecting back from an external static page created with [GitHub Pages](https://github.com/proyecto26/react-native-inappbrowser/tree/gh-pages).
- Use `ASWebAuthenticationSession` instead of `SFAuthenticationSession` for **iOS** >= 12.

## [2.0.3] - 2019-05-02
### Fixed
- Wrong `registerEventBus` been called from `close` event on **Android**, using `unregister` of `EventBus` instead.

## [2.0.2] - 2019-05-02
### Added
- README now contains the different options to open the browser.

### Changed
- Fix **Android** animations by adding `customTabsIntent.startAnimationBundle` when the `ChromeTabsManagerActivity` intent is created by [@miktolon](https://github.com/miktolon)
- Using **Android** `AssertionError` instead of use `Assertion` lib of Facebook by [@SnaiNeR](https://github.com/SnaiNeR)
- Set modal presentation style of **SFSafariViewController** to `UIModalPresentationNone` instead of `UIModalPresentationOverFullScreen`.
- Update example to use RN 0.59.5

## [2.0.1] - 2019-04-12
### Fixed
- Fix flow types by [@petekp](https://github.com/petekp)

## [2.0.0] - 2019-03-21
### Added
- Default methods to open and close the embedded browser **(open, close)** with options.
- Methods to open and close external urls to authenticate the user **(openAuth, closeAuth)** using deep linking.
- `isAvailable` method to detect if the device supports the plugin

## [...2.0.0]
Missing tags for previous versions 🤷‍♂
### Added
- Create `InAppBrowser for React Native` library inspired by [WebBrowser](https://docs.expo.io/versions/latest/sdk/webbrowser) component of [Expo SDK](https://github.com/expo/expo-sdk/blob/dce1ad93dba25dc5eab486f23e77ba4ec9b6d415/src/WebBrowser.js).
- Include options to costumize the browser, inspired from [Chrome Custom Tabs for React Native](https://github.com/droibit/react-native-custom-tabs) and [A React Native wrapper for Safari View Controller](https://github.com/naoufal/react-native-safari-view).
- Include **readermode** property for **iOS** options by [@EQuimper](https://github.com/EQuimper).
- Let status bar been managed from the react-native side by [@EQuimper](https://github.com/EQuimper).
- Typescript support by [@bonesyblue](https://github.com/bonesyblue).
- Fix result type when **ChromeTabsManagerActivity** is dismissed by [@mlazari](https://github.com/mlazari).
- Move podspec file to root project by [@plamworapot](https://github.com/plamworapot).
- Fix gradle compile config by [@fschindler](https://github.com/fschindler).
- Include **supportLibVersion** definition to avoid collisions by [@maestor](https://github.com/maestor).
- Fix the repository URL for podspec file by [@adammcarth](https://github.com/adammcarth).
- Provide example how to restore old status bar style by [@MrLoh](https://github.com/MrLoh).
- Add `com.facebook.infer.annotation` dependecy to fix build error by [Artem Emelyanov](mailto:snainer@gmail.com).
- Clear `mOpenBrowserPromise` after sending a cancel by [@rbscott](https://github.com/rbscott).
- Fix README to import native package in `MainApplication` instead of `MainActivity` by [@mammad2c](https://github.com/mammad2c).
- Update the `isAvailable` method to return a boolean instead by [@kikketer](https://github.com/kikketer).
- Fix **TypeScript** typings by [@petekp](https://github.com/petekp).
- Fix `EventBusException` on **Android** by [@Almouro](https://github.com/Almouro)


[Unreleased]: https://github.com/proyecto26/react-native-inappbrowser/compare/2.0.4...HEAD
[2.0.4]: https://github.com/proyecto26/react-native-inappbrowser/compare/2.0.3...2.0.4
[2.0.3]: https://github.com/proyecto26/react-native-inappbrowser/compare/2.0.2...2.0.3
[2.0.2]: https://github.com/proyecto26/react-native-inappbrowser/compare/2.0.1...2.0.2
[2.0.1]: https://github.com/proyecto26/react-native-inappbrowser/compare/2.0...2.0.1
[2.0.0]: https://github.com/proyecto26/react-native-inappbrowser/releases/tag/2.0
[...2.0.0]: https://github.com/proyecto26/react-native-inappbrowser/compare/bf51cfd...2.0
