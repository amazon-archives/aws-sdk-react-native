//
// Copyright 2010-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator
} from 'react-native';

//AWS connection values
import awsmobile from './aws-exports';

import UserData from './UserData.js'
import RegisterLogin from './RegisterLogin.js'

var Cognito = require('NativeModules').Login;

class cognitoUserPools extends Component {
  constructor(props){
    super(props);
    let cognitoSettings = {
      region: awsmobile.aws_project_region,
      appId: awsmobile.ios_appId,
      appSecret: awsmobile.ios_appSecret,
      userPoolId: awsmobile.aws_user_pools_id
    }
    Cognito.initWithOptions(cognitoSettings);
  }
  render() {
    return (
        <Navigator
          initialRoute={{title: 'Home'}}
          renderScene={this.renderScene}
          style={{padding: 60}}
        />
    )
  }
  renderScene(route,navigator){
    if(route.title == 'Main'){
      return <UserData title='User Data' navigator={navigator} {...route.passProps} />
    }
    if(route.title == 'Home'){
      return <RegisterLogin title='Register or Login' navigator={navigator} {...route.passProps} />
    }
  }
}

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
});

AppRegistry.registerComponent('cognitoUserPools', () => cognitoUserPools);
