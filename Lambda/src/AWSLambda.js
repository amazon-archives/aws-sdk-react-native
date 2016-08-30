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
  Platform,
  NativeModules,
} from 'react-native';

var LambdaClient = NativeModules.AWSRNLambdaClient;

export default class AWSLambda{
 /*
  * Represents a AWSLambda class
  * @constructor
  */
  constructor(){

  }
  /*
  * Creates a Lambda client with the given region and registers it.
  * @param {string} region - the service region
  * @example
  * InstanceOfLambdaClient.initWithOptions({"region":"bucketRegion"})
  */
  initWithOptions(options){
    LambdaClient.initWithOptions(options);
  }

 /*
  *  Invokes a specific Lambda function.
  * If you are using the versioning feature, you can invoke the specific function version by providing function version or alias name that is pointing to the function version using the Qualifier parameter in the request. If you don't provide the Qualifier parameter, the $LATEST version of the Lambda function is invoked. For information about the versioning feature, see http://docs.aws.amazon.com/lambda/latest/dg/versioning-aliases.html" - AWS Lambda Function Versioning and Aliases.
  * This operation requires permission for the lambda:InvokeFunction action.
  * @param {map} invocationRequest -  Required Parameters: [FunctionName]
  */
  async Invoke(options){
    var returnValue = await LambdaClient.Invoke(options);
    return returnValue;
  }



}
