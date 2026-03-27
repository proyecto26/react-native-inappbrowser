import {
  Alert,
  Platform,
  StatusBar,
  Linking,
  StatusBarStyle,
} from 'react-native';
import {InAppBrowser} from 'react-native-inappbrowser-reborn';

const sleep = (timeout: number) =>
  new Promise<void>(resolve => setTimeout(resolve, timeout));

export const openLink = async (
  url: string,
  statusBarStyle: StatusBarStyle,
  animated = true,
) => {
  try {
    // const {width, height} = Dimensions.get('window');
    if (await InAppBrowser.isAvailable()) {
      // A delay to change the StatusBar when the browser is opened
      const delay = animated && Platform.OS === 'ios' ? 400 : 0;
      setTimeout(() => StatusBar.setBarStyle('light-content'), delay);
      const options = {
        // iOS Properties
        ephemeralWebSession: true,
        // Android Properties
        incognito: true,
      };
      console.log('openLink -> options', options);
      const result = await InAppBrowser.openAuth(url, url, options);
      // A delay to show an alert when the browser is closed
      await sleep(800);
      Alert.alert('Response', JSON.stringify(result));
    } else {
      Linking.openURL(url);
    }
  } catch (error) {
    await sleep(50);
    const errorMessage = (error as Error).message || (error as string);
    Alert.alert(errorMessage);
  } finally {
    // Restore the previous StatusBar of the App
    StatusBar.setBarStyle(statusBarStyle);
  }
};

export const getDeepLink = (path = '') => {
  const scheme = 'my-demo';
  const prefix =
    Platform.OS === 'android' ? `${scheme}://demo/` : `${scheme}://`;
  return prefix + path;
};

export const tryDeepLinking = async () => {
  const loginUrl = 'https://proyecto26.github.io/react-native-inappbrowser/';
  const redirectUrl = getDeepLink();
  const url = `${loginUrl}?redirect_url=${encodeURIComponent(redirectUrl)}`;
  try {
    if (await InAppBrowser.isAvailable()) {
      const result = await InAppBrowser.openAuth(url, redirectUrl, {
        // iOS Properties
        ephemeralWebSession: false,
        // Android Properties
        showTitle: false,
        enableUrlBarHiding: true,
        enableDefaultShare: false,
      });
      await sleep(800);
      Alert.alert('Response', JSON.stringify(result));
    } else {
      Alert.alert('InAppBrowser is not supported :/');
    }
  } catch (error) {
    console.error(error);
    Alert.alert('Something’s wrong with the app :(');
  }
};
