# [Draft] Accounts Apple for Meteor React Native.


**Currently, this package only works for iOS apps.**

## Prerequisites

- You are using React Native version `0.60` or higher.

- (iOS only) You have setup react-native iOS development environment on your machine (Will only work on Mac). If not, please follow the official React Native documentation for getting started: [React Native getting started documentation](https://facebook.github.io/react-native/docs/getting-started).

- (iOS only) You are using Xcode version `11` or higher. This will allow you to develop using iOS version `13` and higher, when the APIs for Sign In with Apple became available.

- **Once you're sure you've met the above, please follow our [Initial development environment setup](https://github.com/invertase/react-native-apple-authentication/blob/master/docs/INITIAL_SETUP.md) guide.**

## Installation

In your react native app, run the following command to install it:

```shell
npm install @meteorrn/oauth-apple
```

In your meteor app, make sure you have installed the following packages:

```shell
meteor add accounts-base accounts-password quave:apple-oauth service-configuration
```

And add this configuration in a server's file:

```js
import { Meteor } from 'meteor/meteor';
import { ServiceConfiguration } from 'meteor/service-configuration';

if (Meteor.isDevelopment) {
    if (Meteor.settings.private?.OAUTH?.apple) {
        process.env.OAUTH_APPLE_CLIENT_ID = Meteor.settings.private.OAUTH.apple.CLIENT_ID;
        process.env.OAUTH_APPLE_MOBILE_CLIENT_ID = Meteor.settings.private.OAUTH.apple.MOBILE_CLIENT_ID;
        process.env.OAUTH_APPLE_SECRET = Meteor.settings.private.OAUTH.apple.SECRET;
        process.env.OAUTH_APPLE_TEAM_ID = Meteor.settings.private.OAUTH.apple.TEAM_ID;
        process.env.OAUTH_APPLE_KEY_ID = Meteor.settings.private.OAUTH.apple.KEY_ID;
        process.env.OAUTH_APPLE_REDIRECT_URI = Meteor.settings.private.OAUTH.apple.REDIRECT_URI;
    } else {
        console.warn('[App name] - Apple OAuth settings are not configured.');
    	process.env.OAUTH_APPLE_CLIENT_ID = '';
    	process.env.OAUTH_APPLE_MOBILE_CLIENT_ID = '';
    	process.env.OAUTH_APPLE_SECRET = '';
    	process.env.OAUTH_APPLE_TEAM_ID = '';
    	process.env.OAUTH_APPLE_KEY_ID = '';
    	process.env.OAUTH_APPLE_REDIRECT_URI = '';
    }
}

ServiceConfiguration.configurations.upsert({ service: 'apple' }, {
    $set: {
        nativeClientId: process.env.OAUTH_APPLE_MOBILE_CLIENT_ID,
        clientId: process.env.OAUTH_APPLE_CLIENT_ID,
        teamId: process.env.OAUTH_APPLE_TEAM_ID,
        keyId: process.env.OAUTH_APPLE_KEY_ID,
        secret: process.env.OAUTH_APPLE_SECRET,
        redirectUri: process.env.OAUTH_APPLE_REDIRECT_URI
    }
});
```

Make sure you have environment variables configured in your `settings-settings.json` file:

```json
{
  "private": {
    "ROOT_URL": "http://localhost",
    "OAUTH": {
      "apple": {
        "MOBILE_CLIENT_ID": "< your app id (mobile) >",
        "CLIENT_ID": "< your service id (for web) >",
        "TEAM_ID": "yourTeamId",
        "KEY_ID": "yourKeyId",
        "SECRET": "-----BEGIN PRIVATE KEY-----\nABC\nABC\nABC\nABC\n-----END PRIVATE KEY-----",
        "REDIRECT_URI": "https://abc.def/_oauth/apple"
      }
    }
  }
}
```

## Usage


### Login

```js
import { Component } from 'react';
import { View } from 'react-native';
import { Platform } from 'react-native';
import Meteor from '@meteorrn/core';
import '@meteorrn/oauth-apple';
import AppleButton from './path/to/customAppleButton';

export default class Login extends Component {

    handleAppleLogin() {
        try {
            Meteor.loginWithApple((error)=>{
                if (!error) {
    	            //Do anything
                } else {
    	            console.error('There was an error in login with Apple: ', error);
                }
            });
            // login success, then do anything
        } catch (exception) {
            // error in login with Apple
            console.error(exception);
        }
    }

    render() {
        return (
            <View>
                {Platform.OS === 'ios' && <AppleButton onPress={ handleAppleLogin }/>}
            </View>
        );
    }
};
```
