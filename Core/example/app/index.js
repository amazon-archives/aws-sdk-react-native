//
// Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License").
// You may not use this file except in compliance with the License.
// A copy of the License is located at
//
// http://aws.amazon.com/apache2.0
//
// or in the "license" file accompanying this file. This file is distributed
// on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
// express or implied. See the License for the specific language governing
// permissions and limitations under the License.
//
const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
  AccessToken
} = FBSDK;
import React, { Component } from 'react';
import {AWSCognitoCredentials} from 'aws-sdk-react-native-core';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  NativeModules,
  NativeAppEventEmitter
} from 'react-native';
var fbookToken = ''
var supplyLogins = false;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
  fbButton: {
    borderColor: '#2d5073',
    backgroundColor: '#3b5998',
  },
  attribute: {
    fontSize: 5
  }
});

var region = "INSERTREGION";
var identity_pool_id = "INSERTIDENTITYPOOLID";

export default class example extends Component{
  constructor(props) {
    super(props);
    this.state = {
      loginMessage: 'Log Into Facebook',
      Authenticated:'False',
      identityID: '',
      AccessKey:'',
      SecretKey:'',
      SessionKey:'',
      Expiration:'',
      isLoggedIn: false
    };
    AWSCognitoCredentials.identityChanged = function(Previous,Current){
      console.log("PreviousID: " + Previous);
      console.log("CurrentID: " + Current);
    }
    AWSCognitoCredentials.getLogins = function(){
      if(supplyLogins){
        var map = {};
        map[AWSCognitoCredentials.RNC_FACEBOOK_PROVIDER] = fbookToken;
        return map;
      }else{
        return "";
      }
    };
  }
  Refresh(){
    var that = this;
    async function getCredAndID(){
      try{
        var variable = await AWSCognitoCredentials.getCredentialsAsync();
        that.setState({AccessKey:variable["AccessKey"],SecretKey:variable["SecretKey"],
        SessionKey:variable["SessionKey"],Expiration:variable["Expiration"].toString()});
        variable = await AWSCognitoCredentials.getIdentityIDAsync();
        that.setState({identityID:variable.identityid});
      }catch(e){
        console.log("Error: " + e)
        return;
      }
    }
    getCredAndID();
    AWSCognitoCredentials.isAuthenticated(function(error, variable){
      if(error){
        console.log("Error: " + error)
      }else{
        if (variable) {
          that.setState({Authenticated:"True"});
        }else{
          that.setState({Authenticated:"False"});
        }
      }
    });
  }
  ClearCred(){
    AWSCognitoCredentials.clearCredentials();
  }
  ClearKeychain(){
    AWSCognitoCredentials.clear();
  }
  onLoginInvoked(isLoggingIn, Accesstoken){
    that = this;
    if(isLoggingIn){
      fbookToken = Accesstoken;
      supplyLogins = true;
      AWSCognitoCredentials.initWithOptions({"region":region,"identity_pool_id":identity_pool_id})
      var map = {};
      map[AWSCognitoCredentials.RNC_FACEBOOK_PROVIDER] = fbookToken;
      AWSCognitoCredentials.setLogins(map); //ignored for iOS
      return;
    }else{
      supplyLogins = false;
    }
  }
  render() {
    return (
      <View style={styles.container}>
      <Text>is User Authenticated?: {this.state.Authenticated}</Text>
      <Text>Identity Id: {this.state.identityID}</Text>
      <Text>AccessKey: {this.state.AccessKey}</Text>
      <Text>SecretKey: {this.state.SecretKey}</Text>
      <Text>SessionKey: </Text><Text style={styles.attribute}>{this.state.SessionKey}</Text>
      <Text>Expiration: {this.state.Expiration}</Text>
      <View>
      <LoginButton
      onLoginFinished={
        (error, result) => {
          if (error) {
            alert("login has error: " + result.error);
          } else if (result.isCancelled) {
            alert("login is cancelled.");
          } else {
            AccessToken.getCurrentAccessToken().then(
              (data) => {
                this.onLoginInvoked(true,data.accessToken.toString());
              }
            )
          }
        }
      }
      onLogoutFinished={() => this.onLoginInvoked(false,"")}/>
      </View>
      <Text onPress={this.Refresh.bind(this)}>
      Click Me To Refresh The View!!!
      </Text>
      <Text onPress={this.ClearCred.bind(this)}>
      Click Me To Clear Credentials!!
      </Text>
      <Text onPress={this.ClearKeychain.bind(this)}>
      Click Me To Clear Keychain!
      </Text>
      </View>
    );
  }
}
