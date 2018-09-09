
# InAppBrowser for React Native

<img width="400px" src="img/inappbrowser.png">

## Getting started

`$ npm install react-native-inappbrowser-reborn --save`

### Mostly automatic installation

`$ react-native link react-native-inappbrowser-reborn`

### Manual installation


#### iOS

1. In XCode, in the project navigator, right click `Libraries` ➜ `Add Files to [your project's name]`
2. Go to `node_modules` ➜ `react-native-inappbrowser-reborn` and add `RNInAppBrowser.xcodeproj`
3. In XCode, in the project navigator, select your project. Add `libRNInAppBrowser.a` to your project's `Build Phases` ➜ `Link Binary With Libraries`
4. Run your project (`Cmd+R`)<

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.proyecto26.inappbrowser.RNInAppBrowserPackage;` to the imports at the top of the file
  - Add `new RNInAppBrowserPackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-inappbrowser-reborn'
  	project(':react-native-inappbrowser-reborn').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-inappbrowser-reborn/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-inappbrowser-reborn')
  	```

## Usage
```javascript
import InAppBrowser from 'react-native-inappbrowser-reborn';

...
async openLink() {
  try {
    await InAppBrowser.isAvailable()
    InAppBrowser.open('https://www.google.com', {
      // iOS Properties
      dismissButtonStyle: 'cancel',
      preferredBarTintColor: 'gray',
      preferredControlTintColor: 'white',
      // Android Properties
      showTitle: true,
      toolbarColor: '#6200EE',
      secondaryToolbarColor: 'black',
      enableUrlBarHiding: true,
      enableDefaultShare: true,
    }).then((result) => {
      Alert.alert(JSON.stringify(result))
    })
  } catch (error) {
    Alert.alert(error.message)
  }
}
...
```

## Supporting 🍻
I believe in Unicorns 🦄
Support [me](http://www.paypal.me/jdnichollsc/2), if you do too.

## Happy coding 💯
Made with ❤️

<img width="150px" src="http://phaser.azurewebsites.net/assets/nicholls.png" align="right">