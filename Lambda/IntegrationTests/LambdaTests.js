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
  NativeModules,
  NativeAppEventEmitter,
  DeviceEventEmitter
} from 'react-native';

import {AWSLambda} from 'aws-sdk-react-native-lambda';
import {AWSCognitoCredentials} from 'aws-sdk-react-native-core';

var shouldResolve = false;

var functionName = "HelloWorld";
var cognitoRegion = "us-east-1";
var identity_pool_id = "us-east-1:d304c2aa-8418-429f-a785-ba4c23753548";
var serviceRegion = "us-east-1";

var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
export default class LambdaTests{

  constructor(){
    shouldResolve = false;
  }

  async Setup() : Promise<any> {
    Promise.all([AWSCognitoCredentials.initWithOptions({"region":cognitoRegion,"identity_pool_id":identity_pool_id})]).then(()=>{
      AWSLambda.initWithOptions({"region":serviceRegion});
    });
    return;
  }
  /**
  *  Base64 encode
  *  http://www.webtoolkit.info/
  **/
  _utf8_encode(string) {
    string = string.replace(/\r\n/g,"\n");
    var utftext = "";
    for (var n = 0; n < string.length; n++) {
      var c = string.charCodeAt(n);
      if (c < 128) {
        utftext += String.fromCharCode(c);
      }
      else if((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      }
      else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }
    }
    return utftext;
  }
  encode(input){
    var output = "";
    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
    var i = 0;
    input = this._utf8_encode(input);
    while (i < input.length) {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);
      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;
      if (isNaN(chr2)) {
        enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
        enc4 = 64;
      }
      output = output +
      _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
      _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
    }
    return output;
  }
  async TestLambdaFunction() : Promise<any> {
    try{
      await this.Setup();
      shouldResolve = false;
      // Call the function sync
      var InvokeRequest = {
        "FunctionName" : functionName,
        "InvocationType" : "RequestResponse",
        "LogType" : "None",
        "ClientContext" : this.encode(JSON.stringify({"System":"iOS"})),
        "Payload" : JSON.stringify({"key1":"hello!"})
      };
      var response = await AWSLambda.Invoke(InvokeRequest);
      if(response.LogResult){
        console.error("response.LogResult should not be present");
        shouldResolve = false;
        return shouldResolve;
      }
      if(!response.Payload){
        console.error("response.Payload is not present");
        shouldResolve = false;
        return shouldResolve;
      }
      if(response.Payload.Length === 0){
        console.error("response.Payload.Length is 0. Response payload length: " + response.Payload.Length);
        shouldResolve = false;
        return shouldResolve;
      }
      if(response.StatusCode === 0){
        console.error("response.StatusCode is 0. Response code: " + response.StatusCode);
        shouldResolve = false;
        return shouldResolve;
      }
      // Call the function sync, dry run, no payload
      InvokeRequest = {
        "FunctionName" : functionName,
        "InvocationType" : "DryRun",
        "LogType" : "None",
        "ClientContext" : this.encode(JSON.stringify({"System":"iOS"})),
        "Payload" : JSON.stringify({"key1":"hello!"})
      };
      response = await AWSLambda.Invoke(InvokeRequest);
      if(response.LogResult){
        console.error("response.LogResult should not be present");
        shouldResolve = false;
        return shouldResolve;
      }
      if(response.Payload){
        console.error("response.Payload is not present");
        shouldResolve = false;
        return shouldResolve;
      }
      if(response.StatusCode === 0){
        console.error("response.StatusCode is 0. Response code: " + response.StatusCode);
        shouldResolve = false;
        return shouldResolve;
      }

    }catch(e){
      console.error(e);
      shouldResolve = false;
      return shouldResolve;
    }
    // Call the function sync, pass non-JSON payload
    var InvokeRequest = {
      "FunctionName" : functionName,
      "InvocationType" : "DryRun",
      "LogType" : "None",
      "ClientContext" : this.encode(JSON.stringify({"System":"iOS"})),
      "Payload" : "Key:Testing"
    };
    try{
      response = await AWSLambda.Invoke(InvokeRequest);
    }catch(e){
      shouldResolve = true;
      return shouldResolve;
    }
    try{
      console.error("The invocation without proper payload passed");
    }catch(e){
      console.error(e);
      this.shouldResolve = false;
      return shouldResolve;
    }
  }

}
