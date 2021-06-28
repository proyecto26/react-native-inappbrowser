/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useCallback, useState} from 'react';
import {
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
} from 'react-native';
import {openLink, tryDeepLinking} from './utils';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const App = () => {
  const [url, setUrl] = useState('https://reactnative.dev');
  const [statusBarStyle] = useState('dark-content');

  const onOpenLink = useCallback(async () => {
    await openLink(url, statusBarStyle);
  }, [url, statusBarStyle]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle={statusBarStyle} />
      <Text style={styles.welcome}>
        {'Welcome InAppBrowser\nfor React Native!'}
      </Text>
      <Text style={styles.instructions}>Type the url</Text>
      <TextInput
        style={styles.urlInput}
        onChangeText={text => setUrl(text)}
        value={url}
      />
      <View style={styles.openButton}>
        <Button title="Open link" onPress={onOpenLink} />
      </View>
      <View style={styles.openButton}>
        <Button title="Try deep linking" onPress={tryDeepLinking} />
      </View>
      <Text style={styles.instructions}>{instructions}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 30,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  urlInput: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
  },
  openButton: {
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: Platform.OS === 'ios' ? 0 : 20,
  },
});

export default App;
