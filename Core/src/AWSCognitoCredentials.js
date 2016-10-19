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

var cognitoClient = NativeModules.AWSRNCognitoCredentials;
var listener;

if (Platform.OS === 'ios'){
  listener = NativeAppEventEmitter;
}else{
  listener = DeviceEventEmitter;
}

export default class AWSCognitoCredentials{
 /*
  * Represents a AWSCognitoCredentials class
  * @constructor
  */
  constructor(){
    //constants
    this.RNC_FACEBOOK_PROVIDER = "FacebookProvider"
    this.RNC_DIGITS_PROVIDER = "DigitsProvider"
    this.RNC_GOOGLE_PROVIDER = "GoogleProvider"
    this.RNC_AMAZON_PROVIDER = "AmazonProvider"
    this.RNC_TWITTER_PROVIDER = "TwitterProvider"
    this.RNC_COGNITO_PROVIDER = "CognitoProvider"

    //set up delegate for IdentityProvider
    if (Platform.OS === 'ios'){
      listener.addListener("LoginsRequestedEvent", async {callbackId} => {
        const logins = [await Promise.resolve(this.getLogins())];
        cognitoClient.sendCallbackResponse(callbackId, logins);
      });
    }
    //Set up Notifications for Identity Changes
    listener.addListener("IdentityChange", async event => {
      if (!event.Previous){
        event.Previous = ""
      }
      if (!event.Current){
        event.Current = ""
      }
      this.identityChanged(event.Previous,event.Current)
    });
  }
/*
 * This is an identity changed listener to process some event when the
 * identity has changed.
 * Empty string if the client returned nil/null
 * @param {string} Previous
 * @param {string} Current
 * @example
 * InstanceOfAWSCognitoCredentials.identityChanged = function(Previous,Current){
 *     console.log("Previous ID: " + Previous)
 *     console.log("Current ID: " + Current)
 * }
 */
identityChanged(Previous,Current){
}
/*
 * Each entry in logins represents a single login with an identity provider. The key
 * is the domain of the login provider (e.g. 'graph.facebook.com') and the value
 * is the OAuth/OpenId Connect token that results from an authentication with that
 * login provider.
 * @example
 * InstanceOfAWSCognitoCredentials.getLogins = function(){
 *   return {InstanceOfAWSCognitoCredentials.RNC_FACEBOOK_PROVIDER : <UserFacebookTokenString>}
 * }
 */
getLogins(){
}
/*
 * Gets the Cognito identity id of the user. The first time when this method
 * is called, a network request will be made to retrieve a new identity id.
 * After that it's saved in {@link SharedPreferences}. Please don't call it
 * in the main thread.
 * @example
 * async function getID(){
 *  try{
 *   var variable = await InstanceOfAWSCognitoCredentials.getIdentityIDAsync();
 *   console.log("The Identity ID: " + variable.identityid);
 *  }catch(e){
 *   console.log("Error: " + e)
 *   return;
 *  }
 * }
 * getID();
*/
async getIdentityIDAsync(){
  var returned =  await cognitoClient.getIdentityIDAsync();
  return returned;
}
/*
 * Asynchronously returns a valid AWS credentials or an error object if it cannot
 * retrieve valid credentials. It should cache valid credentials as much as possible
 * and refresh them when they are invalid.
 * @example
 * async function getCredentials(){
 *  try{
 *   var credentials = await InstanceOfAWSCognitoCredentials.getCredentialsAsync();
 *   console.log("The AccessKey: " + credentials["AccessKey"]);
 *   console.log("The SecretKey: " + credentials["SecretKey"]);
 *   console.log("The SessionKey: " + credentials["SessionKey"]);
 *   console.log("The Expiration: " + credentials["Expiration"]); //iOS only
 *  }catch(e){
 *   console.log("Error: " + e)
 *   return;
 *  }
 * }
 * getCredentials();
*/
async getCredentialsAsync(){
  var returned =  await cognitoClient.getCredentialsAsync();
  return returned;
}
/*
 * Is this provider considered 'authenticated'. By default, only returns YES if logins is set.
 * @param {function} callback
 * @example
 * InstanceOfAWSCognitoCredentials.isAuthenticated(function(error, variable){
 *  if(error){
 *    console.log("What is my error?: " + error + "  What is my message?: " + variable);
 *  }else{
 *    console.log("Am I authenticated?: " + variable);
 *  }
 * });
 */
isAuthenticated(callback){
  cognitoClient.isAuthenticated(callback);
}
/*
 * Clear the cached AWS credentials for this provider.
 * @example
 * InstanceOfAWSCognitoCredentials.clearCredentials();
 */
clearCredentials(){
  cognitoClient.clearCredentials();
}
/*
 * Clear ALL saved values for this provider (identityId, credentials, logins).
 * @example
 * InstanceOfAWSCognitoCredentials.clear();
 */
clear(){
  cognitoClient.clear();
}
/*
 * Android only method:
 * Set the logins map used to authenticated with Amazon Cognito.
 * @param {map} logins
 * @example
 * var map = {};
 * map[InstanceOfAWSCognitoCredentials.RNC_FACEBOOK_PROVIDER] = fbookToken;
 * InstanceOfAWSCognitoCredentials.setLogins(map); //ignored for iOS
*/
setLogins(Logins){
  if (Platform.OS === 'ios'){
    console.log("Set Logins ignored for iOS")
    return;
  }
  if(typeof(Logins)=='object' && Object.keys(Logins).length !== 0){
    cognitoClient.setLogins(Logins);
  }else{
    console.log("Logins parameter is not a map, or it was empty: " + Logins)
  }
}
/*
 * Internal method to invoke getLogins (client) and setLogins (Android SDK)
 * periodically for android
 */
refreshLogins(){
  if (Platform.OS == 'android'){ //should never be false but anyways
    if (typeof(this.getLogins()) == "object"){ //check if they filled the method
      cognitoClient.setLogins(this.getLogins())
    }
  }
}
/*
 * Constructs a new CognitoCachingCredentialsProvider, which will
 * use the specified Amazon Cognito identity pool to make a request to
 * Cognito, using the enhanced flow, to get short lived session credentials,
 * which will then be returned by this class's getCredentials()
 * method.
 * Note: if you haven't yet associated your IAM roles with your identity
 * pool, please do so via the Cognito console before using this constructor.
 * You will get an InvalidIdentityPoolConfigurationException if you use it
 * and have not. The existing constructor (mirroring this one but with roles
 * and an account id) will work without doing so, but will not use the
 * enhanced flow.
 @param region {String} The region in which your identity pool exists.
 @param identity_pool_id {String} The identity pool id for this provider. Value is used
        to communicate with Amazon Cognito as well as namespace values stored in the keychain.
 * @example
 * InstanceOfAWSCognitoCredentials.initWithOptions({"region":"INSERTREGION",
 * "identity_pool_id":"INSERTIDENTITYPOOLID"})
 */
initWithOptions(options){
  if (Platform.OS == 'android'){
    if(!options.refreshTime){
      window.setInterval(this.refreshLogins.bind(this), 3300000);
    }else{
      window.setInterval(this.refreshLogins.bind(this), options.refreshTime);
    }
  }
  if(!options.identity_pool_id){
    return "Error: No identity_pool_id";
  }
  if(!options.region){
    return "Error: No region";
  }
  cognitoClient.initWithOptions(options)
  if (Platform.OS == 'android'){
    if (typeof(this.getLogins()) == "object"){
      cognitoClient.setLogins(this.getLogins())
    }
  }
 }
}
