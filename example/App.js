/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  Alert,
  TextInput,
  StatusBar,
  Linking
} from 'react-native'
import InAppBrowser from 'react-native-inappbrowser-reborn'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu'
})

export default class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      url: 'https://www.google.com'
    }
  }
  sleep (timeout) {
    return new Promise(resolve => setTimeout(resolve, timeout))
  }

  async openLink () {
    const { url } = this.state
    try {
      if (await InAppBrowser.isAvailable()) {
        StatusBar.setBarStyle('light-content')
        const result = await InAppBrowser.open(url, {
          // iOS Properties
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#453AA4',
          preferredControlTintColor: 'white',
          readerMode: false,
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
        await this.sleep(800)
        Alert.alert('Response', JSON.stringify(result))
      } else Linking.openURL(url)
    } catch (error) {
      Alert.alert(error.message)
    }
  }

  getDeepLink (path = '') {
    const scheme = 'my-demo'
    const prefix = Platform.OS === 'android' ? `${scheme}://demo/` : `${scheme}://`
    return prefix + path
  }

  async tryDeepLinking () {
    const redirectToURL = `https://proyecto26.github.io/react-native-inappbrowser/`
    const redirectUrl = this.getDeepLink('home')
    const url = `${redirectToURL}?redirect_url=${encodeURIComponent(redirectUrl)}`
    try {
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.openAuth(url, redirectUrl)
        await this.sleep(800)
        Alert.alert('Response', JSON.stringify(result))
      } else {
        Alert.alert('InAppBrowser is not supported :/')
      }
    } catch (error) {
      Alert.alert('Something’s wrong with the app :(')
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <StatusBar barStyle='dark-content' />
        <Text style={styles.welcome}>{'Welcome InAppBrowser\nfor React Native!'}</Text>
        <Text style={styles.instructions}>Type the url</Text>
        <TextInput
          style={styles.urlInput}
          onChangeText={(text) => this.setState({ url: text })}
          value={this.state.url}
        />
        <View style={styles.openButton}>
          <Button title='Open link' onPress={() => this.openLink()} />
        </View>
        <View style={styles.openButton}>
          <Button title='Try deep linking' onPress={() => this.tryDeepLinking()} />
        </View>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    padding: 30
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5
  },
  urlInput: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1
  },
  openButton: {
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingBottom: Platform.OS === 'ios' ? 0 : 20
  }
})
