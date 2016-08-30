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

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  DeviceEventEmitter,
  NativeModules
} from 'react-native';

var executor = NativeModules.AWSRNTestExecutor
import SNSTests from "./SNSTests";
var Tests = new SNSTests();
AppRegistry.registerComponent(Tests.displayName, () => Tests)

var IntegrationTests = React.createClass({
  getInitialState: function() {
    DeviceEventEmitter.addListener("TestChannel", async event => {
      console.log("Starting " + event.testname);
      var testname = event.testname;
      if(testname === "TestCrudTopics"){
        this.TestCRUDTopics();
      }
      if(testname === "TestSubscribeTopicPart1"){
        this.TestSubscribeTopicPart1();
      }
      if(testname === "TestSubscribeTopicPart2"){
        this.TestSubscribeTopicPart2();
      }
      if(testname === "TestPublishAsJson"){
        this.TestPublishAsJson();
      }
    });
    return {};
  },
  TestCRUDTopics(){
    async function test(){
      try{
        var resolved = await Tests.TestCRUDTopics();
      }catch(e){
        executor.testUpdateStatus({"error":e, "isFailed": true});
      }
      if(!resolved){
        executor.testUpdateStatus({"error":"TestCRUDTopics has returned false", "isFailed": true});
      }else{
        executor.testUpdateStatus({"isFailed": false});
      }
    }
    test();
  },
  TestSubscribeTopicPart1(){
    async function test(){
      try{
        var resolved = await Tests.TestSubscribeTopicPart1();
      }catch(e){
        executor.testUpdateStatus({"error":e, "isFailed": true});
      }
      if(!resolved){
        executor.testUpdateStatus({"error":"TestSubscribeTopicPart1 has returned false", "isFailed": true});
      }else{
        executor.testUpdateStatus({"isFailed": false});
      }
    }
    test();
  },
  TestSubscribeTopicPart2(){
    async function test(){
      try{
        var resolved = await Tests.TestSubscribeTopicPart2();
      }catch(e){
        executor.testUpdateStatus({"error":e, "isFailed": true});
      }
      if(!resolved){
        executor.testUpdateStatus({"error":"TestSubscribeTopicPart2 has returned false", "isFailed": true});
      }else{
        executor.testUpdateStatus({"isFailed": false});
      }
    }
    test();
  },
  TestPublishAsJson(){
    async function test(){
      try{
        var resolved = await Tests.TestPublishAsJson();
      }catch(e){
        executor.testUpdateStatus({"error":e, "isFailed": true});
      }
      if(!resolved){
        executor.testUpdateStatus({"error":"TestPublishAsJson has returned false", "isFailed": true});
      }else{
        executor.testUpdateStatus({"isFailed": false});
      }
    }
    test();
  },
  render: function() {
    return (
      <Text onPress={this.TestCRUDTopics.bind(this)}>Please run the testing suite located in the android directory at app/src/androidTest/java/com/integrationtests/Tests.java. Refer to the README.txt in the root of the folder for more information.</Text>
    );
  }
});

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


AppRegistry.registerComponent('IntegrationTests', () => IntegrationTests);
