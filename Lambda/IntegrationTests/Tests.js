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

var {
  Text,
  View,
} = ReactNative;
var { TestModule } = ReactNative.NativeModules;

import LambdaTests from "./LambdaTests";
var lambdatests = new LambdaTests();

var Tests = React.createClass({
  shouldResolve: false,
  shouldReject: false,
  propTypes: {
    RunSampleCall: React.PropTypes.bool
  },

  getInitialState() {
    return {
      done: false,
    };
  },
  componentDidMount() {
    if(this.props.TestName === "TestLambdaFunction"){
      Promise.all([this.TestLambdaFunction()]).then(()=>
      {
        TestModule.markTestPassed(this.shouldResolve);
      });
      return;
    }
  },
  async TestLambdaFunction() : Promise<any> {
    try{
      var resolved = await lambdatests.TestLambdaFunction();
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

Tests.displayName = 'Tests';

module.exports = Tests;
