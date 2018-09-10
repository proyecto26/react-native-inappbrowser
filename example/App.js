/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button, Alert, TextInput} from 'react-native';
import InAppBrowser from 'react-native-inappbrowser-reborn';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

export default class App extends Component {

  constructor(props) {
    super(props)

    this.state = {
      url: 'https://www.google.com'
    }
  }

  async openLink() {
    try {
      await InAppBrowser.isAvailable()
      InAppBrowser.open(this.state.url, {
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
        forceCloseOnRedirection: true,
      }).then((result) => {
        Alert.alert(JSON.stringify(result))
      })
    } catch (error) {
      Alert.alert(error.message)
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>{'Welcome InAppBrowser\nfor React Native!'}</Text>
        <Text style={styles.instructions}>Type the url</Text>
        <TextInput
          style={styles.urlInput}
          onChangeText={(text) => this.setState({url: text})}
          value={this.state.url}
        />
        <View style={styles.openButton}>
          <Button title='Open link' onPress={() => this.openLink()}></Button>
        </View>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
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
    paddingBottom: Platform.OS === 'ios' ? 0 : 20
  }
});