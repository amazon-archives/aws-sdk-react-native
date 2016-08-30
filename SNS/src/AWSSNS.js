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

var SNSClient = NativeModules.AWSRNSNSClient;

export default class AWSSNS{
 /*
  * Represents a AWSSNS class
  * @constructor
  */
  constructor(){

  }
  /*
  * Creates a SNS client with the given region and registers it.
  * @param {string} region - the service region
  * @example
  * InstanceOfSNSClient.initWithOptions({"region":"bucketRegion"})
  */
  initWithOptions(options){
    SNSClient.initWithOptions(options);
  }

 /*
  * Returns a list of the requester's subscriptions. Each call returns a limited list of subscriptions, up to 100. If there are more subscriptions, a NextToken is also returned. Use the NextToken parameter in a new ListSubscriptions call to get further results.
  * @param {map} listSubscriptionsInput - Input for ListSubscriptions action.
  */
  async ListSubscriptions(options){
    var returnValue = await SNSClient.ListSubscriptions(options);
    return returnValue;
  }

 /*
  * Allows a topic owner to set an attribute of the topic to a new value.
  * @param {map} setTopicAttributesInput - Input for SetTopicAttributes action. Required Parameters: [TopicArn, AttributeName]
  */
  async SetTopicAttributes(options){
    var returnValue = await SNSClient.SetTopicAttributes(options);
    return returnValue;
  }

 /*
  * Returns all of the properties of a subscription.
  * @param {map} getSubscriptionAttributesInput - Input for GetSubscriptionAttributes. Required Parameters: [SubscriptionArn]
  */
  async GetSubscriptionAttributes(options){
    var returnValue = await SNSClient.GetSubscriptionAttributes(options);
    return returnValue;
  }

 /*
  * Retrieves the endpoint attributes for a device on one of the supported push notification services, such as GCM and APNS. For more information, see http://docs.aws.amazon.com/sns/latest/dg/SNSMobilePush.html" - Using Amazon SNS Mobile Push Notifications.
  * @param {map} getEndpointAttributesInput - Input for GetEndpointAttributes action. Required Parameters: [EndpointArn]
  */
  async GetEndpointAttributes(options){
    var returnValue = await SNSClient.GetEndpointAttributes(options);
    return returnValue;
  }

 /*
  * Creates a platform application object for one of the supported push notification services, such as APNS and GCM, to which devices and mobile apps may register. You must specify PlatformPrincipal and PlatformCredential attributes when using the CreatePlatformApplication action. The PlatformPrincipal is received from the notification service. For APNS/APNS_SANDBOX, PlatformPrincipal is "SSL certificate". For GCM, PlatformPrincipal is not applicable. For ADM, PlatformPrincipal is "client id". The PlatformCredential is also received from the notification service. For WNS, PlatformPrincipal is "Package Security Identifier". For MPNS, PlatformPrincipal is "TLS certificate". For Baidu, PlatformPrincipal is "API key".
  * For APNS/APNS_SANDBOX, PlatformCredential is "private key". For GCM, PlatformCredential is "API key". For ADM, PlatformCredential is "client secret". For WNS, PlatformCredential is "secret key". For MPNS, PlatformCredential is "private key". For Baidu, PlatformCredential is "secret key". The PlatformApplicationArn that is returned when using CreatePlatformApplication is then used as an attribute for the CreatePlatformEndpoint action. For more information, see http://docs.aws.amazon.com/sns/latest/dg/SNSMobilePush.html" - Using Amazon SNS Mobile Push Notifications. For more information about obtaining the PlatformPrincipal and PlatformCredential for each of the supported push notification services, see http://docs.aws.amazon.com/sns/latest/dg/mobile-push-apns.html" - Getting Started with Apple Push Notification Service, http://docs.aws.amazon.com/sns/latest/dg/mobile-push-adm.html" - Getting Started with Amazon Device Messaging, http://docs.aws.amazon.com/sns/latest/dg/mobile-push-baidu.html" - Getting Started with Baidu Cloud Push, http://docs.aws.amazon.com/sns/latest/dg/mobile-push-gcm.html" - Getting Started with Google Cloud Messaging for Android, http://docs.aws.amazon.com/sns/latest/dg/mobile-push-mpns.html" - Getting Started with MPNS, or http://docs.aws.amazon.com/sns/latest/dg/mobile-push-wns.html" - Getting Started with WNS.
  * @param {map} createPlatformApplicationInput - Input for CreatePlatformApplication action. Required Parameters: [Name, Platform, Attributes]
  */
  async CreatePlatformApplication(options){
    var returnValue = await SNSClient.CreatePlatformApplication(options);
    return returnValue;
  }

 /*
  * Deletes the endpoint for a device and mobile app from Amazon SNS. This action is idempotent. For more information, see http://docs.aws.amazon.com/sns/latest/dg/SNSMobilePush.html" - Using Amazon SNS Mobile Push Notifications.
  * When you delete an endpoint that is also subscribed to a topic, then you must also unsubscribe the endpoint from the topic.
  * @param {map} deleteEndpointInput - Input for DeleteEndpoint action. Required Parameters: [EndpointArn]
  */
  async DeleteEndpoint(options){
    var returnValue = await SNSClient.DeleteEndpoint(options);
    return returnValue;
  }

 /*
  * Prepares to subscribe an endpoint by sending the endpoint a confirmation message. To actually create a subscription, the endpoint owner must call the ConfirmSubscription action with the token from the confirmation message. Confirmation tokens are valid for three days.
  * @param {map} subscribeInput - ut for Subscribe action. Required Parameters: [TopicArn, Protocol]
  */
  async Subscribe(options){
    var returnValue = await SNSClient.Subscribe(options);
    return returnValue;
  }

 /*
  * Sets the attributes of the platform application object for the supported push notification services, such as APNS and GCM. For more information, see http://docs.aws.amazon.com/sns/latest/dg/SNSMobilePush.html" - Using Amazon SNS Mobile Push Notifications. For information on configuring attributes for message delivery status, see http://docs.aws.amazon.com/sns/latest/dg/sns-msg-status.html" - Using Amazon SNS Application Attributes for Message Delivery Status.
  * @param {map} setPlatformApplicationAttributesInput - Input for SetPlatformApplicationAttributes action. Required Parameters: [PlatformApplicationArn, Attributes]
  */
  async SetPlatformApplicationAttributes(options){
    var returnValue = await SNSClient.SetPlatformApplicationAttributes(options);
    return returnValue;
  }

 /*
  * Returns all of the properties of a topic. Topic properties returned might differ based on the authorization of the user.
  * @param {map} getTopicAttributesInput - Input for GetTopicAttributes action. Required Parameters: [TopicArn]
  */
  async GetTopicAttributes(options){
    var returnValue = await SNSClient.GetTopicAttributes(options);
    return returnValue;
  }

 /*
  * Removes a statement from a topic's access control policy.
  * @param {map} removePermissionInput - Input for RemovePermission action. Required Parameters: [TopicArn, Label]
  */
  async RemovePermission(options){
    var returnValue = await SNSClient.RemovePermission(options);
    return returnValue;
  }

 /*
  * Lists the platform application objects for the supported push notification services, such as APNS and GCM. The results for ListPlatformApplications are paginated and return a limited list of applications, up to 100. If additional records are available after the first page results, then a NextToken string will be returned. To receive the next page, you call ListPlatformApplications using the NextToken string received from the previous call. When there are no more records to return, NextToken will be null. For more information, see http://docs.aws.amazon.com/sns/latest/dg/SNSMobilePush.html" - Using Amazon SNS Mobile Push Notifications.
  * @param {map} listPlatformApplicationsInput - Input for ListPlatformApplications action.
  */
  async ListPlatformApplications(options){
    var returnValue = await SNSClient.ListPlatformApplications(options);
    return returnValue;
  }

 /*
  * Allows a subscription owner to set an attribute of the topic to a new value.
  * @param {map} setSubscriptionAttributesInput - Input for SetSubscriptionAttributes action. Required Parameters: [SubscriptionArn, AttributeName]
  */
  async SetSubscriptionAttributes(options){
    var returnValue = await SNSClient.SetSubscriptionAttributes(options);
    return returnValue;
  }

 /*
  * Deletes a topic and all its subscriptions. Deleting a topic might prevent some messages previously sent to the topic from being delivered to subscribers. This action is idempotent, so deleting a topic that does not exist does not result in an error.
  * @param {map} deleteTopicInput -  Required Parameters: [TopicArn]
  */
  async DeleteTopic(options){
    var returnValue = await SNSClient.DeleteTopic(options);
    return returnValue;
  }

 /*
  * Adds a statement to a topic's access control policy, granting access for the specified AWS accounts to the specified actions.
  * @param {map} addPermissionInput -  Required Parameters: [TopicArn, Label, AWSAccountId, ActionName]
  */
  async AddPermission(options){
    var returnValue = await SNSClient.AddPermission(options);
    return returnValue;
  }

 /*
  * Deletes a platform application object for one of the supported push notification services, such as APNS and GCM. For more information, see http://docs.aws.amazon.com/sns/latest/dg/SNSMobilePush.html" - Using Amazon SNS Mobile Push Notifications.
  * @param {map} deletePlatformApplicationInput - Input for DeletePlatformApplication action. Required Parameters: [PlatformApplicationArn]
  */
  async DeletePlatformApplication(options){
    var returnValue = await SNSClient.DeletePlatformApplication(options);
    return returnValue;
  }

 /*
  * Verifies an endpoint owner's intent to receive messages by validating the token sent to the endpoint by an earlier Subscribe action. If the token is valid, the action creates a new subscription and returns its Amazon Resource Name (ARN). This call requires an AWS signature only when the AuthenticateOnUnsubscribe flag is set to "true".
  * @param {map} confirmSubscriptionInput - ut for ConfirmSubscription action. Required Parameters: [TopicArn, Token]
  */
  async ConfirmSubscription(options){
    var returnValue = await SNSClient.ConfirmSubscription(options);
    return returnValue;
  }

 /*
  * Deletes a subscription. If the subscription requires authentication for deletion, only the owner of the subscription or the topic's owner can unsubscribe, and an AWS signature is required. If the Unsubscribe call does not require authentication and the requester is not the subscription owner, a final cancellation message is delivered to the endpoint, so that the endpoint owner can easily resubscribe to the topic if the Unsubscribe request was unintended.
  * @param {map} unsubscribeInput - Input for Unsubscribe action. Required Parameters: [SubscriptionArn]
  */
  async Unsubscribe(options){
    var returnValue = await SNSClient.Unsubscribe(options);
    return returnValue;
  }

 /*
  * Creates an endpoint for a device and mobile app on one of the supported push notification services, such as GCM and APNS. CreatePlatformEndpoint requires the PlatformApplicationArn that is returned from CreatePlatformApplication. The EndpointArn that is returned when using CreatePlatformEndpoint can then be used by the Publish action to send a message to a mobile app or by the Subscribe action for subscription to a topic. The CreatePlatformEndpoint action is idempotent, so if the requester already owns an endpoint with the same device token and attributes, that endpoint's ARN is returned without creating a new endpoint. For more information, see http://docs.aws.amazon.com/sns/latest/dg/SNSMobilePush.html" - Using Amazon SNS Mobile Push Notifications.
  * When using CreatePlatformEndpoint with Baidu, two attributes must be provided: ChannelId and UserId. The token field must also contain the ChannelId. For more information, see http://docs.aws.amazon.com/sns/latest/dg/SNSMobilePushBaiduEndpoint.html" - Creating an Amazon SNS Endpoint for Baidu.
  * @param {map} createPlatformEndpointInput - Input for CreatePlatformEndpoint action. Required Parameters: [PlatformApplicationArn, Token]
  */
  async CreatePlatformEndpoint(options){
    var returnValue = await SNSClient.CreatePlatformEndpoint(options);
    return returnValue;
  }

 /*
  * Creates a topic to which notifications can be published. Users can create at most 100,000 topics. For more information, see http://aws.amazon.com/sns/" - http://aws.amazon.com/sns. This action is idempotent, so if the requester already owns a topic with the specified name, that topic's ARN is returned without creating a new topic.
  * @param {map} createTopicInput - Input for CreateTopic action. Required Parameters: [Name]
  */
  async CreateTopic(options){
    var returnValue = await SNSClient.CreateTopic(options);
    return returnValue;
  }

 /*
  * Retrieves the attributes of the platform application object for the supported push notification services, such as APNS and GCM. For more information, see http://docs.aws.amazon.com/sns/latest/dg/SNSMobilePush.html" - Using Amazon SNS Mobile Push Notifications.
  * @param {map} getPlatformApplicationAttributesInput - Input for GetPlatformApplicationAttributes action. Required Parameters: [PlatformApplicationArn]
  */
  async GetPlatformApplicationAttributes(options){
    var returnValue = await SNSClient.GetPlatformApplicationAttributes(options);
    return returnValue;
  }

 /*
  * Returns a list of the requester's topics. Each call returns a limited list of topics, up to 100. If there are more topics, a NextToken is also returned. Use the NextToken parameter in a new ListTopics call to get further results.
  * @param {map} listTopicsInput -
  */
  async ListTopics(options){
    var returnValue = await SNSClient.ListTopics(options);
    return returnValue;
  }

 /*
  * Sends a message to all of a topic's subscribed endpoints. When a messageId is returned, the message has been saved and Amazon SNS will attempt to deliver it to the topic's subscribers shortly. The format of the outgoing message to each subscribed endpoint depends on the notification protocol selected.
  * To use the Publish action for sending a message to a mobile endpoint, such as an app on a Kindle device or mobile phone, you must specify the EndpointArn. The EndpointArn is returned when making a call with the CreatePlatformEndpoint action. The second example below shows a request and response for publishing to a mobile endpoint.
  * For more information about formatting messages, see http://docs.aws.amazon.com/sns/latest/dg/mobile-push-send-custommessage.html" - Send Custom Platform-Specific Payloads in Messages to Mobile Devices.
  * @param {map} publishInput - Input for Publish action. Required Parameters: [Message]
  */
  async Publish(options){
    var returnValue = await SNSClient.Publish(options);
    return returnValue;
  }

 /*
  * Sets the attributes for an endpoint for a device on one of the supported push notification services, such as GCM and APNS. For more information, see http://docs.aws.amazon.com/sns/latest/dg/SNSMobilePush.html" - Using Amazon SNS Mobile Push Notifications.
  * @param {map} setEndpointAttributesInput - Input for SetEndpointAttributes action. Required Parameters: [EndpointArn, Attributes]
  */
  async SetEndpointAttributes(options){
    var returnValue = await SNSClient.SetEndpointAttributes(options);
    return returnValue;
  }

 /*
  * Lists the endpoints and endpoint attributes for devices in a supported push notification service, such as GCM and APNS. The results for ListEndpointsByPlatformApplication are paginated and return a limited list of endpoints, up to 100. If additional records are available after the first page results, then a NextToken string will be returned. To receive the next page, you call ListEndpointsByPlatformApplication again using the NextToken string received from the previous call. When there are no more records to return, NextToken will be null. For more information, see http://docs.aws.amazon.com/sns/latest/dg/SNSMobilePush.html" - Using Amazon SNS Mobile Push Notifications.
  * @param {map} listEndpointsByPlatformApplicationInput - Input for ListEndpointsByPlatformApplication action. Required Parameters: [PlatformApplicationArn]
  */
  async ListEndpointsByPlatformApplication(options){
    var returnValue = await SNSClient.ListEndpointsByPlatformApplication(options);
    return returnValue;
  }

 /*
  * Returns a list of the subscriptions to a specific topic. Each call returns a limited list of subscriptions, up to 100. If there are more subscriptions, a NextToken is also returned. Use the NextToken parameter in a new ListSubscriptionsByTopic call to get further results.
  * @param {map} listSubscriptionsByTopicInput - Input for ListSubscriptionsByTopic action. Required Parameters: [TopicArn]
  */
  async ListSubscriptionsByTopic(options){
    var returnValue = await SNSClient.ListSubscriptionsByTopic(options);
    return returnValue;
  }



}
