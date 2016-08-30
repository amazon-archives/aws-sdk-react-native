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
'use strict';

var React = require('react');
var ReactNative = require('react-native');
import {AWSDynamoDB} from 'aws-sdk-react-native-dynamodb';
import {AWSCognitoCredentials} from 'aws-sdk-react-native-core';
var {
  Text,
  View,
} = ReactNative;
var { TestModule } = ReactNative.NativeModules;
import DynamoDBTests from "./DynamoDBTests";
var dynamodbtests = new DynamoDBTests();

var ServiceTests = React.createClass({
  shouldResolve: false,
  propTypes: {
    RunSampleCall: React.PropTypes.bool
  },
  getInitialState() {
    return {
      done: false,
    };
  },
  componentDidMount() {
    if(this.props.TestName === "TestTableCallsAsync"){
      Promise.all([this.TestTableCallsAsync()]).then(()=>
      {
        TestModule.markTestPassed(this.shouldResolve);
      });
      return;
    }
    if(this.props.TestName === "TestHashTable"){
      Promise.all([this.TestHashTable()]).then(()=>
      {
        TestModule.markTestPassed(this.shouldResolve);
      });
      return;
    }
    if(this.props.TestName === "TestHashRangeTable"){
      Promise.all([this.TestHashRangeTable()]).then(()=>
      {
        TestModule.markTestPassed(this.shouldResolve);
      });
      return;
    }
    if(this.props.TestName === "TestBatchWriteGet"){
      Promise.all([this.TestBatchWriteGet()]).then(()=>
      {
        TestModule.markTestPassed(this.shouldResolve);
      });
      return;
    }
    if(this.props.TestName === "TestLargeBatches"){
      Promise.all([this.TestLargeBatches()]).then(()=>
      {
        TestModule.markTestPassed(this.shouldResolve);
      });
      return;
    }
  },
  async TestTableCallsAsync() : Promise<any> {
    try{
      var resolved = await dynamodbtests.TestTableCallsAsync();
    }catch(e){
      console.error(e);
      this.shouldResolve = false;
      return;
    }
    if(!resolved){
      this.shouldResolve = false;
      return;
    }
    this.shouldResolve = true;
  },
  async TestHashTable() : Promise<any> {
    try{
      var resolved = await dynamodbtests.TestHashTable();
    }catch(e){
      console.error(e);
      this.shouldResolve = false;
      return;
    }
    if(!resolved){
      this.shouldResolve = false;
      return;
    }
    this.shouldResolve = true;
  },
  async TestHashRangeTable() : Promise<any> {
    try{
      var resolved = await dynamodbtests.TestHashRangeTable();
    }catch(e){
      console.error(e);
      this.shouldResolve = false;
      return;
    }
    if(!resolved){
      this.shouldResolve = false;
      return;
    }
    this.shouldResolve = true;
  },
  async TestBatchWriteGet() : Promise<any> {
    try{
      var resolved = await dynamodbtests.TestBatchWriteGet();
    }catch(e){
      console.error(e);
      this.shouldResolve = false;
      return;
    }
    if(!resolved){
      this.shouldResolve = false;
      return;
    }
    this.shouldResolve = true;
  },
  async TestLargeBatches() : Promise <any> {
    try{
      var resolved = await dynamodbtests.TestLargeBatches();
    }catch(e){
      console.error(e);
      this.shouldResolve = false;
      return;
    }
    if(!resolved){
      this.shouldResolve = false;
      return;
    }
    this.shouldResolve = true;
  },
  render() : ReactElement<any> {
    return <View />;
  }
});

ServiceTests.displayName = 'ServiceTests';

module.exports = ServiceTests;
