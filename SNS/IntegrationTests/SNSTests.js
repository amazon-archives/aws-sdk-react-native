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
  NativeAppEventEmitter,
  DeviceEventEmitter
} from 'react-native';

import {AWSSNS} from 'aws-sdk-react-native-sns';
import {AWSCognitoCredentials} from 'aws-sdk-react-native-core';

var emailAddress = "INSERTEMAILADDRESS";
var cognitoRegion = "INSERTCOGNITOREGION";
var identity_pool_id = "INSERTIDENTITYPOOLID";
var topicARN = "INSERTTOPICARN"
var serviceRegion = "INSERTSNSREGION"
var shouldResolve = false;

export default class SNSTests{

  constructor(){
    shouldResolve = false;
  }
  async Setup() : Promise<any> {
    Promise.all([AWSCognitoCredentials.initWithOptions({"region":cognitoRegion,"identity_pool_id":identity_pool_id})]).then(()=>{
      AWSSNS.initWithOptions({"region":serviceRegion});
    });
    return;
  }
  async GetAllTopics() : Promise<any> {
    var topics = [];
    var nextToken = "temp";
    while(nextToken !== ""){
      try{
        var newList = await AWSSNS.ListTopics({})
        topics = newList.Topics.concat(topics);
        nextToken = ""
      }catch(e){
        console.error(e)
        shouldResolve = false;
        return shouldResolve;
      }
    }
    return topics;
  }
  async TestCRUDTopics() : Promise<any> {
    await this.Setup();
    shouldResolve = false;
    var topics = []
    try{
      topics = await this.GetAllTopics();
    }catch(e){
      console.error(e);
      shouldResolve = false;
      return shouldResolve;
    }
    var oldTopicCount = topics.length;
    var exampleTopicName = "ReactNative" + (new Date).getTime();
    var arn = '';
    var createTopicRequest =
    {
      "Name" : exampleTopicName
    };
    try{
      var returned = await AWSSNS.CreateTopic(createTopicRequest);
      var arn = returned.TopicArn;
    }catch(e){
      console.error(e);
      shouldResolve = false;
      return shouldResolve;
    }
    try{
      topics = await this.GetAllTopics();
    }catch(e){
      console.error(e);
      shouldResolve = false;
      return shouldResolve;
    }
    var newTopicCount = topics.length;
    if(oldTopicCount === newTopicCount){
      console.error("Create Topic failed");
      shouldResolve = false;
      return shouldResolve;
    }
    var SetTopicAttributesRequest = {
      "TopicArn" : arn,
      "AttributeName" : "DisplayName",
      "AttributeValue" : "Test topic"
    };
    try{
      await AWSSNS.SetTopicAttributes(SetTopicAttributesRequest);
    }catch(e){
      console.error(e);
      shouldResolve = false;
      return shouldResolve;
    }
    var getTopicAttributesRequest =
    {
      "TopicArn" : arn
    };
    try{
      var attributes = await AWSSNS.GetTopicAttributes(getTopicAttributesRequest);
      if(SetTopicAttributesRequest.AttributeValue !== attributes.Attributes.DisplayName){
        console.error("Set topic attributes failed: " + attributes.Attributes.DisplayName);
      }
    }catch(e){
      console.error(e);
      shouldResolve = false;
      return shouldResolve;
    }
    var deleteTopicRequest =
    {
      "TopicArn" : arn
    };
    try{
      await AWSSNS.DeleteTopic(deleteTopicRequest);
    }catch(e){
      console.error(e);
      shouldResolve = false;
      return shouldResolve;
    }
    try{
      topics = await this.GetAllTopics();
    }catch(e){
      console.error(e);
      shouldResolve = false;
      return shouldResolve;
    }
    newTopicCount = topics.length;
    if(newTopicCount!==oldTopicCount){
      console.error("Delete topic failed");
      shouldResolve = false;
      return shouldResolve;
    }
    shouldResolve = true;
    return shouldResolve;
  }
  async TestSubscribeTopicPart1() : Promise<any> {
    await this.Setup();
    shouldResolve = false;
    var subscribeRequest= {
      "Protocol":"email",
      "TopicArn":topicARN, //set at the top
      "Endpoint":emailAddress //set at the top
    }
    try{
      await AWSSNS.Subscribe(subscribeRequest);
    }catch(e){
      console.error(e);
      shouldResolve = false;
      return shouldResolve;
    }
    shouldResolve = true;
    return shouldResolve;
  }
  async TestSubscribeTopicPart2() : Promise<any> {
    await this.Setup();
    shouldResolve = false;
    var listSubscriptionsRequest =
    {
      "TopicArn" : topicARN
    };
    try{
      var returned = await AWSSNS.ListSubscriptionsByTopic(listSubscriptionsRequest);
      var subs = returned.Subscriptions;
      var count = subs.length;
      if(count !== 1){
        console.error("There is not one subscription");
        shouldResolve = false;
        return shouldResolve;
      }
      var subscription = subs[0];
      if(subscription.SubscriptionArn === "PendingConfirmation"){
        console.error("User is not subscribed");
        shouldResolve = false;
        return shouldResolve;
      }
      var publishRequest = {
        "TopicArn":topicARN,
        "Subject":"React Native Testing Sample Subject",
        "Message":"React Native Testing Sample Message"
      }
      var returned = await AWSSNS.Publish(publishRequest)

      var unsubscribeRequest = {
        "SubscriptionArn":subscription.SubscriptionArn
      }
      var returned = await AWSSNS.Unsubscribe(unsubscribeRequest)

    }catch(e){
      console.error(e);
      shouldResolve = false;
      return shouldResolve;
    }
    shouldResolve = true;
    return shouldResolve;

  }
  async TestPublishAsJson() : Promise<any> {
    await this.Setup();
    shouldResolve = false;
    try{
      var publishRequest =
      {
        "TopicArn" : topicARN,
        "MessageStructure" : "json",
        "Message" : "stuff"
      };
      var returned = await AWSSNS.Publish(publishRequest)
      console.error("it returned succesful?: " + returned);
      shouldResolve = false;
      return shouldResolve;

    }catch(e){
      var userInfo = e.message;
      if(!userInfo.includes("InvalidParameter")){
        console.error("InvalidParameter code was not returned: " + JSON.stringify(e.message));
        shouldResolve = false;
        return shouldResolve;
      }
      if(!userInfo.includes("parse")){
        console.error("Message did not include the phrase \"parse\": " + JSON.stringify(e.message));
        shouldResolve = false;
        return shouldResolve;
      }
      try{
        publishRequest.Message = "{\"default\" : \"Data\"}";
        var returned = await AWSSNS.Publish(publishRequest)
      }catch(e){
        console.error(e);
        shouldResolve = false;
        return shouldResolve;
      }
      shouldResolve = true;
      return shouldResolve;
    }
    shouldResolve = false;
    return shouldResolve;
  }
}
