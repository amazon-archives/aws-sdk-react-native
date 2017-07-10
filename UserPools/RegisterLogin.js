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

import React, { Component, PropTypes } from 'react';
import { View, Text, TextInput, Button, Navigator } from 'react-native';
import Prompt from 'react-native-prompt';
var loginHandler = require('NativeModules').Login;

import {
  loginUser,
  registerUser,
  confirmUser
} from './Auth.js';

export default class MyScene extends Component {
  constructor(props){
    super(props);
    this.state = {
      username: 'username',
      password: '',
      newUser: '',
      newPass: '',
      email: '',
      phone: ''
    }
  }

  async userLogin(){
    try {
    await loginUser(this.state.username, this.state.password);
    console.log('Testing');
      this.props.navigator.push({
        title: 'Main'
      })
    }catch(e){
      alert('Login failed: ' + e);
    }
  }

  render() {
    return (
      <View>
        <Text style={{fontSize:20,fontWeight:'bold', padding:10}}>{this.props.title}</Text>
  
        <TextInput
          style={{height:20, borderColor:'gray', borderWidth:1}}
          onChangeText={(username)=>this.setState({username})}
          value={this.state.username} />
        <TextInput
          secureTextEntry={true}
          style={{height:20, borderColor:'gray', borderWidth:1}}
          onChangeText={(password)=>this.setState({password})}
          value={this.state.password} />
        
        <Button
          onPress={ () =>this.userLogin() }
          title="Sign-In"
          color="#841584"
          accessibilityLabel="Press this button to login"/>

        <TextInput
          style={{height:20, borderColor:'gray', borderWidth:1}}
          onChangeText={(newUser)=>this.setState({newUser})}
          value={this.state.newUser} />
        <TextInput
          secureTextEntry={true}
          style={{height:20, borderColor:'gray', borderWidth:1}}
          onChangeText={(newPass)=>this.setState({newPass})}
          value={this.state.newPass} />
        <TextInput
          style={{height:20, borderColor:'gray', borderWidth:1}}
          onChangeText={(email)=>this.setState({email})}
          value={this.state.email} />        
        <TextInput
          style={{height:20, borderColor:'gray', borderWidth:1}}
          onChangeText={(phone)=>this.setState({phone})}
          value={this.state.phone} />


        <Button
          onPress={()=>registerUser(
            this.state.newUser,
            this.state.newPass,
            this.state.email,
            this.state.phone
          )}
          title="Register User"
          color="#841584"
          accessibilityLabel="Press this button to register a new user" />


        <Button
          onPress={() => this.setState({ promptVisible: true }) }
          title="Enter Confirmation code"
          color="#841584"
          accessibilityLabel="Press to enter your confirmation code after registration"/>
        

        <Prompt
    		title="Enter Confirmation Code"
    		placeholder=""
    		defaultValue=""
    		visible={ this.state.promptVisible }
    		onCancel={ () => this.setState({
      			promptVisible: false,
      			message: "You cancelled"
    		})}
    		onSubmit={ (value) => {
            this.setState({ promptVisible: false,
             })
            confirmUser(this.state.newUser, value);
          }
        }
        />
      </View>
    )
  }
}