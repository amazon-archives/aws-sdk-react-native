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

var RekognitionClient = NativeModules.AWSRNRekognitionClient;

export default class AWSRekognition{
 /*
  * Represents a AWSRekognition class
  * @constructor
  */
  constructor(){

  }
  /*
  * Creates a Rekognition client with the given region and registers it.
  * @param {string} region - the service region
  * @example
  * InstanceOfRekognitionClient.initWithOptions({"region":"bucketRegion"})
  */
  initWithOptions(options){
    RekognitionClient.initWithOptions(options);
  }

 /*
  * Returns a list of the requester's subscriptions. Each call returns a limited list of subscriptions, up to 100. If there are more subscriptions, a NextToken is also returned. Use the NextToken parameter in a new ListSubscriptions call to get further results.
  * @param {map} listSubscriptionsInput - Input for ListSubscriptions action.
  */
  async ListCollections(options){
    var returnValue = await RekognitionClient.ListCollections(options);
    return returnValue;
  }

}
