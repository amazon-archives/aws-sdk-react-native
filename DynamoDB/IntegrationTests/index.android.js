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
import DynamoDBTests from "./DynamoDBTests";
var Tests = new DynamoDBTests();
AppRegistry.registerComponent(Tests.displayName, () => Tests)

var IntegrationTests = React.createClass({
  getInitialState: function() {
    DeviceEventEmitter.addListener("TestChannel", async event => {
      console.log("Starting " + event.testname);
      var testname = event.testname;
      if(testname === "TestTableCallsAsync"){
        this.TestTableCallsAsync();
      }
      if(testname === "TestHashTable"){
        this.TestHashTable();
      }
      if(testname === "TestHashRangeTable"){
        this.TestHashRangeTable();
      }
      if(testname === "TestBatchWriteGet"){
        this.TestBatchWriteGet();
      }
      if(testname === "TestLargeBatches"){
        this.TestLargeBatches();
      }
    });
    return {};
  },
  TestTableCallsAsync(){
    async function test(){
      try{
        var resolved = await Tests.TestTableCallsAsync();
      }catch(e){
        executor.testUpdateStatus({"error":e,"isFailed":true});
      }
      if(!resolved){
        executor.testUpdateStatus({"error":"TestTableCallsAsync has returned false","isFailed":true});
      } else {
        executor.testUpdateStatus({"isFailed":false});
      }
    }
    test();
  },
  TestHashTable(){
    async function test(){
      try{
        var resolved = await Tests.TestHashTable();
      }catch(e){
        executor.testUpdateStatus({"error":e,"isFailed":true});
      }
      if(!resolved){
        executor.testUpdateStatus({"error":"TestHashTable has returned false","isFailed":true});
      } else {
        executor.testUpdateStatus({"isFailed":false});
      }
    }
    test();
  },
  TestHashRangeTable(){
    async function test(){
      try{
        var resolved = await Tests.TestHashRangeTable();
      }catch(e){
        executor.testUpdateStatus({"error":e,"isFailed":true});
      }
      if(!resolved){
        executor.testUpdateStatus({"error":"TestHashRangeTable has returned false","isFailed":true});
      } else {
        executor.testUpdateStatus({"isFailed":false});
      }
    }
    test();
  },
  TestBatchWriteGet(){
    async function test(){
      try{
        var resolved = await Tests.TestBatchWriteGet();
      }catch(e){
        executor.testUpdateStatus({"error":e,"isFailed":true});
      }
      if(!resolved){
        executor.testUpdateStatus({"error":"TestBatchWriteGet has returned false","isFailed":true});
      } else {
        executor.testUpdateStatus({"isFailed":false});
      }
    }
    test();
  },
  TestLargeBatches(){
    async function test(){
      try{
        var resolved = await Tests.TestLargeBatches();
      }catch(e){
        executor.testUpdateStatus({"error":e,"isFailed":true});
      }
      if(!resolved){
        executor.testUpdateStatus({"error":"TestLargeBatches has returned false","isFailed":true});
      } else {
        executor.testUpdateStatus({"isFailed":false});
      }
    }
    test();
  },
  render: function() {
    return (
      <Text onPress={this.TestTableCallsAsync.bind(this)}>Please run the testing suite located in the android directory at app/src/androidTest/java/com/integrationtests/Tests.java. Refer to the README.txt in the root of the folder for more information.</Text>
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
