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

//npm install aws-sdk first

import AWS from 'aws-sdk/dist/aws-sdk-react-native';

import awsmobile from './aws-exports';

var loginHandler = require('NativeModules').Login;

export const loginUser = async (username, password) => {
    let loginMap = {
        username: username,
        password: password
    }

    try{
      let session = await loginHandler.signin(loginMap);

      //Get AWS Credentials
      let json = {}, Logins = {};
      let k = 'cognito-idp.' + awsmobile.aws_cognito_region + '.amazonaws.com/' + awsmobile.aws_user_pools_id;
      console.log('k',k);
      Logins[k] = session.idToken;
      json['IdentityPoolId'] = awsmobile.aws_cognito_identity_pool_id;
      json['Logins'] = Logins;
      console.trace('json:' + JSON.stringify(json));
      AWS.config.credentials = new AWS.CognitoIdentityCredentials(json);
    }catch(e){
      console.log(e);
      throw(e);
    }
  }

export const registerUser = async (username, password, email, phone) => {

    let registerData = {
    	username: username,
    	password: password,
    	userAttributes: [{
    		name: 'email',
    		value: email
    	},
        {
            name: 'phone_number',
            value: phone
        }]
    }
    try{
      let register = await loginHandler.registerUser(registerData);
      console.log(register);
      await this.setState({ promptVisible: true, registration:true})
      return register;
    }catch(e){
      console.log(e);
    }
  }

  export const confirmUser = async (username, confirmationCode) => {
  	console.log('confirmation code is ' + confirmationCode)
  	let confirmData = {
  		username: username,
  		confirmationCode: confirmationCode
  	}
    try{
      let confirm = await loginHandler.confirmUser(confirmData);
      console.log('CONFIRM SUCCESS');
      return 'SUCCESS';
    }catch(e){
      console.log(e);
    }
  }

  export const forgotPassword = async () => {
  	console.log('forgot password');
  	try{
      let forgotPwd = await loginHandler.forgotPassword({});
      console.log(forgotPwd);
      await this.setState({ promptVisible: true, registration:false})
      console.log('CONFIRM SUCCESS');
      return 'SUCCESS';
    }catch(e){
      console.log(e);
    }
  }

  export const confirmForgotPassword = async() => {
  	console.log('forgot password');
  	let confirmData = {
  		confirmationCode: this.state.confirmationCode
  	}
  	try{
      let forgotPwd = await loginHandler.forgotPassword(confirmData);
      console.log(forgotPwd);
    }catch(e){
      console.log(e);
    }
  }

  export const refreshSession = async() =>{
    try{
      let refreshSession = await loginHandler.refreshSession({});
      console.log(refreshSession);
      return refreshSession;
    }catch(e){
      console.log(e);
    }
  }

