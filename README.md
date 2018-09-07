
# react-native-inappbrowser
InAppBrowser for React Native

## Getting started

`$ npm install react-native-inappbrowser --save`

### Mostly automatic installation

`$ react-native link react-native-inappbrowser`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-inappbrowser` and add `RNInAppBrowser.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNInAppBrowser.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.proyecto26.inappbrowser.RNInAppBrowserPackage;` to the imports at the top of the file
  - Add `new RNInAppBrowserPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-inappbrowser'
  	project(':react-native-inappbrowser').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-inappbrowser/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-inappbrowser')
  	```

## Usage
```javascript
import RNInAppBrowser from 'react-native-inappbrowser';

// TODO: What to do with the module?
RNInAppBrowser;
```
  