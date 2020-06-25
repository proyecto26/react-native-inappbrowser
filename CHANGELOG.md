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

## [3.4.0] - 2020-04-08

### Added
- Added `ephemeralWebSession` option to supports `ephemeralWebBrowserSession` on iOS 13 by [@avenner](https://github.com/avenner) ([#141](https://github.com/proyecto26/react-native-inappbrowser/pull/141)).
- Add `@ReactModule` annotation by [@janicduplessis](https://github.com/janicduplessis) ([#94](https://github.com/proyecto26/react-native-inappbrowser/pull/94)).

### Fixed
- Remove listener of `openAuth` when `closeAuth` is called.

## [3.3.4] - 2020-01-07

### Fixed
- Disable swipe to dismiss gesture for modal by [@frankyjuang](https://github.com/frankyjuang) ([#134](https://github.com/proyecto26/react-native-inappbrowser/pull/134)).

## [3.3.3] - 2019-11-25

### Fixed
- Remove build warnings with **iOS** 13 using [Pragmas](https://clang.llvm.org/docs/UsersManual.html#controlling-diagnostics-via-pragmas).

## [3.3.2] - 2019-11-15

### Fixed
- Validate if the **type** of the auth result is different to `cancel` before to check the url of the last redirection from **Android**.
- Fixed issue getting the result of the auth redirection by using `AppState` to detect **Android** Activity `OnResume` event once.

## [3.3.1] - 2019-11-13

### Fixed
- Exclude unnecessary file and folders from release distribution by [@SaeedZhiany](https://github.com/SaeedZhiany) ([#114](https://github.com/proyecto26/react-native-inappbrowser/pull/114)).
- Update `.gitignore` to clean unnecessary files by [@friederbluemle](https://github.com/friederbluemle) ([#115](https://github.com/proyecto26/react-native-inappbrowser/pull/115)).
- Use `yarn` instead of `npm` cli by [@friederbluemle](https://github.com/friederbluemle) ([#116](https://github.com/proyecto26/react-native-inappbrowser/pull/116)).
- Update dev dependencies by [@friederbluemle](https://github.com/friederbluemle) ([#117](https://github.com/proyecto26/react-native-inappbrowser/pull/117)).

## [3.3.0] - 2019-11-12

### Fixed
- Removed `waitForRedirectDelay` option and fixed race condition from **Android** to get the response of the redirection ([#36](https://github.com/proyecto26/react-native-inappbrowser/issues/36))
- Fixed **Android** Activity issue closing the browser and restoring the state by using `onSaveInstanceState` ([#60](https://github.com/proyecto26/react-native-inappbrowser/issues/60)).

## [3.2.0] - 2019-11-10

### Added
- Added support for `automatic` modal presentation style from **iOS**.
- Added `enableBarCollapsing` option to determines whether the browser's tool bars will collapse or not from **iOS**.

### Fixed
- Fixed Browser crashes on iOS 13 when openAuth is used.

## [3.1.0] - 2019-09-03

### Added
- Added `waitForRedirectDelay` option for **Android** to fix issues dismissing the browser before detecting the redirection with `Linking` ([817f6ec](https://github.com/proyecto26/react-native-inappbrowser/commit/817f6ece140c0f2f84e21a537d5030403e652bc1)).

## [3.0.1] - 2019-08-16

### Added
- Added gradle backward-compatibility for Android Support with Jetifier ([#96](https://github.com/proyecto26/react-native-inappbrowser/pull/97)).
- Added **androidXAnnotation** and **androidXBrowser** properties from **rootProject.ext** for **AndroidX** with backward compatibility using **supportLibVersion** property instead.

## [3.0.0] - 2019-07-27
### Added
- **Android:** Migrate to AndroidX by [@jdnichollsc](https://github.com/jdnichollsc) ([8a083f2](https://github.com/proyecto26/react-native-inappbrowser/commit/8a083f24847ac5f49923c6217106628434634b4d)).
- Start following [SemVer](https://semver.org) with git tags properly 😅.
- Include a **CHANGELOG.md** to see the history of the changes of the project.
- Validate if `EventBus` of **Android** is registered before to unregister.
- Include ESLint config for React Native.
- Activating Open Collective ([#80](https://github.com/proyecto26/react-native-inappbrowser/pull/80)) and Create **CONTRIBUTING.md** to see how to contribute.
- Added `animated`, `modalPresentationStyle` and `modalTransitionStyle` properties for iOS options ([86f7238](https://github.com/proyecto26/react-native-inappbrowser/commit/86f7238d8eb856b28fae9981ca7bb42b12c43e18)).
- Present the **SafariViewController** modally or as push instead using the `modalEnabled` property ([4a0d57c](https://github.com/proyecto26/react-native-inappbrowser/commit/4a0d57c73eccaaf45a212853c50aa41520b550c8)).
- Add workaround to dismiss **SafariViewController** without animation.

### Removed
- **com.facebook.infer.annotation** dependency is not required anymore to build for **Android** ([dcbfaef](https://github.com/proyecto26/react-native-inappbrowser/commit/dcbfaef49fa04fdabc281cd2c61124a11c6a7d29#diff-7ae5a9093507568eabbf35c3b0665732)).

### BREAKING CHANGES

- **Android:** You are required to only use either the Support Library or AndroidX for your dependencies. If you need to migrate this library back to the support library, or another library forward to AndroidX, then take a look at the [Jetifier tool](https://github.com/mikehardy/jetifier).

## [2.0.4] - 2019-05-16
### Added
- README now contains a badges section.
- Include deep linking example with `demo` schemes, redirecting back from an external static page created with [GitHub Pages](https://github.com/proyecto26/react-native-inappbrowser/tree/gh-pages).
- Use `ASWebAuthenticationSession` instead of `SFAuthenticationSession` for **iOS** >= 12.

## [2.0.3] - 2019-05-02
### Fixed
- Wrong `registerEventBus` been called from `close` event on **Android**, using `unregister` of `EventBus` instead.

## [2.0.2] - 2019-05-02
### Added
- README now contains the different options to open the browser.

### Fixed
- Add `customTabsIntent.startAnimationBundle` when the `ChromeTabsManagerActivity` intent is created to fix **Android** animations by [@miktolon](https://github.com/miktolon) ([3f0cb35](https://github.com/proyecto26/react-native-inappbrowser/commit/3f0cb356733832a4578ebf1cb45377aa0d8d2806)).

### Changed
- Using **Android** `AssertionError` instead of use `Assertion` lib of Facebook by [@SnaiNeR](https://github.com/SnaiNeR) ([e9a54d3](https://github.com/proyecto26/react-native-inappbrowser/commit/e9a54d3fe759380f992aa1ed7fbcf5d1299a7d73)).
- Set modal presentation style of **SFSafariViewController** to `UIModalPresentationNone` instead of `UIModalPresentationOverFullScreen`.
- Update example to use RN 0.59.5.

## [2.0.1] - 2019-04-12
### Fixed
- Fix flow types by [@petekp](https://github.com/petekp) ([66dd631](https://github.com/proyecto26/react-native-inappbrowser/commit/66dd631d0059f5365f4d1bf5ea219d7aef489efe)/[018f505](https://github.com/proyecto26/react-native-inappbrowser/commit/018f5054c6757cf3b8aa2fc6c278e821077c6fbe)).

## [2.0.0] - 2019-03-21
### Added
- Default methods to open and close the embedded browser **(open, close)** with options.
- Methods to open and close external urls to authenticate the user **(openAuth, closeAuth)** using deep linking.
- `isAvailable` method to detect if the device supports the plugin.

## [...2.0.0]
Missing tags for previous versions 🤷‍♂
### Added
- Create `InAppBrowser for React Native` library inspired by [WebBrowser](https://docs.expo.io/versions/latest/sdk/webbrowser) component of [Expo SDK](https://github.com/expo/expo-sdk/blob/dce1ad93dba25dc5eab486f23e77ba4ec9b6d415/src/WebBrowser.js).
- Include options to costumize the browser, inspired from [Chrome Custom Tabs for React Native](https://github.com/droibit/react-native-custom-tabs) and [A React Native wrapper for Safari View Controller](https://github.com/naoufal/react-native-safari-view).
- Include **readermode** property for **iOS** options by [@EQuimper](https://github.com/EQuimper) ([fb3efac](https://github.com/proyecto26/react-native-inappbrowser/commit/fb3efac7098ff222b07612896cfa2956465a9934)).
- Let status bar been managed from the react-native side by [@EQuimper](https://github.com/EQuimper) ([e66f652](https://github.com/proyecto26/react-native-inappbrowser/commit/e66f652792f4f8fbe30fb469733a5441302d8b08)).
- Typescript support by [@bonesyblue](https://github.com/bonesyblue) ([d62f705](https://github.com/proyecto26/react-native-inappbrowser/commit/d62f705006347cf60117bd526ff632f3533524d4)).
- Fix result type when **ChromeTabsManagerActivity** is dismissed by [@mlazari](https://github.com/mlazari) ([f5a0be5](https://github.com/proyecto26/react-native-inappbrowser/commit/f5a0be5efb631980b3dc46fcfb0fecf32f0ed32e)).
- Move podspec file to root project by [@plamworapot](https://github.com/plamworapot) ([aa7d33b](https://github.com/proyecto26/react-native-inappbrowser/commit/aa7d33b7f6fea502b302ba421582a860b6886a5c)).
- Fix gradle compile config by [@fschindler](https://github.com/fschindler) ([8bfa6da](https://github.com/proyecto26/react-native-inappbrowser/commit/8bfa6da07feedd961a49642b365797637506bedd)).
- Include **supportLibVersion** definition to avoid collisions by [@maestor](https://github.com/maestor) ([332ceef](https://github.com/proyecto26/react-native-inappbrowser/commit/332ceefeba4e729237412954b8b941654263bfbd)).
- Fix the repository URL for podspec file by [@adammcarth](https://github.com/adammcarth) ([7e4038c](https://github.com/proyecto26/react-native-inappbrowser/commit/7e4038c19a7e1a44ab01e9dcd762709ab854eb85)).
- Provide example how to restore old status bar style by [@MrLoh](https://github.com/MrLoh) ([8cb9e75](https://github.com/proyecto26/react-native-inappbrowser/commit/8cb9e7535a3edb0d9919eab7813bf5f136f455ff)).
- Add `com.facebook.infer.annotation` dependecy to fix build error by [Artem Emelyanov](mailto:snainer@gmail.com) ([80ff313](https://github.com/proyecto26/react-native-inappbrowser/commit/80ff313c36911d4d82d2885ad8424d7f0f72de29)).
- Clear `mOpenBrowserPromise` after sending a cancel by [@rbscott](https://github.com/rbscott) ([d9cc2a3](https://github.com/proyecto26/react-native-inappbrowser/commit/d9cc2a3183f84790deb22bf01f4f7658d67bc8ca)).
- Fix README to import native package in `MainApplication` instead of `MainActivity` by [@mammad2c](https://github.com/mammad2c) ([ce3f5a9](https://github.com/proyecto26/react-native-inappbrowser/commit/ce3f5a93812a1a2dd7293092bb4a2972f4943268)).
- Update the `isAvailable` method to return a boolean instead by [@kikketer](https://github.com/kikketer) ([1d75810](https://github.com/proyecto26/react-native-inappbrowser/commit/1d75810881cc6fd5a6913fbef986f897d366cdb9)).
- Fix **TypeScript** typings by [@petekp](https://github.com/petekp) ([e0e99a5](https://github.com/proyecto26/react-native-inappbrowser/commit/e0e99a523d9a2df99263ffbed3f2738afd05b46b)).
- Fix `EventBusException` on **Android** by [@Almouro](https://github.com/Almouro) ([9cf4cbb](https://github.com/proyecto26/react-native-inappbrowser/commit/9cf4cbb58d55c8b534dabac6791e6a2a5428253f)).


[Unreleased]: https://github.com/proyecto26/react-native-inappbrowser/compare/v3.4.0...HEAD
[3.4.0]: https://github.com/proyecto26/react-native-inappbrowser/compare/v3.3.4...v3.4.0
[3.3.4]: https://github.com/proyecto26/react-native-inappbrowser/compare/v3.3.3...v3.3.4
[3.3.3]: https://github.com/proyecto26/react-native-inappbrowser/compare/v3.3.2...v3.3.3
[3.3.2]: https://github.com/proyecto26/react-native-inappbrowser/compare/v3.3.1...v3.3.2
[3.3.1]: https://github.com/proyecto26/react-native-inappbrowser/compare/v3.3.0...v3.3.1
[3.3.0]: https://github.com/proyecto26/react-native-inappbrowser/compare/v3.2.0...v3.3.0
[3.2.0]: https://github.com/proyecto26/react-native-inappbrowser/compare/v3.1.0...v3.2.0
[3.1.0]: https://github.com/proyecto26/react-native-inappbrowser/compare/v3.0.1...v3.1.0
[3.0.1]: https://github.com/proyecto26/react-native-inappbrowser/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/proyecto26/react-native-inappbrowser/compare/2.0.4...v3.0.0
[2.0.4]: https://github.com/proyecto26/react-native-inappbrowser/compare/2.0.3...2.0.4
[2.0.3]: https://github.com/proyecto26/react-native-inappbrowser/compare/2.0.2...2.0.3
[2.0.2]: https://github.com/proyecto26/react-native-inappbrowser/compare/2.0.1...2.0.2
[2.0.1]: https://github.com/proyecto26/react-native-inappbrowser/compare/2.0...2.0.1
[2.0.0]: https://github.com/proyecto26/react-native-inappbrowser/releases/tag/2.0
[...2.0.0]: https://github.com/proyecto26/react-native-inappbrowser/compare/bf51cfd...2.0
