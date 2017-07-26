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
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
//setup image picker
var ImagePicker = require('react-native-image-picker');
var options = {
  title: 'Select Photo to Upload to S3',
  cancelButtonTitle: 'Cancel',
  quality: 0.2,
  angle: 0,
  noData: false,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
const S3Region = "INSERTS3REGION"
const CognitoRegion = "INSERTCOGNITOREGION"
const identity_pool_id = "INSERTIDENTITYPOOLID"
const BucketName = "INSERTBUCKET"
const DownloadKeyName = "INSERTDOWNLOADKEY" //should be a file stored on your S3
const UploadKeyName = "INSERTUPLOADKEY" //should be suffixed by jpg since the example uploads a picture from your photos

import {AWSCognitoCredentials} from 'aws-sdk-react-native-core';
import {AWSS3TransferUtility} from 'aws-sdk-react-native-transfer-utility';
let requestTmp = {"isDownload":false,"id":''};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});
class TransferUtility extends Component{
  constructor(props){
    super(props);
    this.state = {
      'requestid': '',
      'type':'',
      'completedUnits':'',
      'totalUnits':'',
      'fractionCompleted':'',
    };
    AWSCognitoCredentials.initWithOptions({"region":CognitoRegion,"identity_pool_id":identity_pool_id})
    var that = this;
    AWSS3TransferUtility.progressEvent = function(requestid,completedUnits,totalUnits,fractionCompleted,type){
      that.setState({
        'requestid': requestid,
        'type':type,
        'completedUnits':completedUnits,
        'totalUnits':totalUnits,
        'fractionCompleted':fractionCompleted,
      });
    }
    AWSS3TransferUtility.completionHandlerEvent = function(requestid,error,request){
      console.log("requestID: " + requestid);
      console.log("error: " + JSON.stringify(error));
      console.log("request: " + JSON.stringify(request));
    }
  }
  initS3(){
    options = {"region":S3Region}
    AWSS3TransferUtility.initWithOptions(options);
  }
  downloadObject(){
    let path;
   if(Platform.OS==='android'){
     path = "/" + BucketName + "/" + DownloadKeyName;
   }else{
     path = DownloadKeyName;
   }
   AWSS3TransferUtility.createDownloadRequest({"path":path,"bucket":BucketName,"key":DownloadKeyName,"subscribe":true,"completionhandler":true},(error,value)=>{
      if(error){
        console.error(error);
      }else{
        requestTmp = {isDownload:true,"id":value}
        async function download(){
          try{
            const val = await AWSS3TransferUtility.download({"requestid":value});
          }catch(e){
            console.log("download failed: " + e)
          }
        }
        download();
      }
    });
  }
  uploadObject(){
    ImagePicker.launchImageLibrary(options, (response)  => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let path;
        if(Platform.OS === 'android'){
          path = response.path;
        }else{
          path = response.uri
        }
        AWSS3TransferUtility.createUploadRequest({"path":path,"bucket":BucketName,"key":UploadKeyName,"contenttype":"image/jpeg","subscribe":true,"completionhandler":true},(error,value)=>{
          if(error){
            console.log(error);
          }else{
            requestTmp = {isDownload:false,"id":value}
            async function upload(){
              try{
                const val = await AWSS3TransferUtility.upload({"requestid":value});
              }catch(e){
                console.log("upload failed: " + e)
              }
            }
            upload();
          }
        });
      }
    });
  }
  pause(){
    AWSS3TransferUtility.editEvent({"config":"pause","request":requestTmp.id})
  }
  resume(){
    AWSS3TransferUtility.editEvent({"config":"resume","request":requestTmp.id})
  }
  cancel(){
    AWSS3TransferUtility.editEvent({"config":"cancel","request":requestTmp.id})
  }
  render() {
    return (
      <View style={styles.container}>
      <Text>type: {this.state.type} requestid: {this.state.requestid}</Text>
      <Text>completedUnits: {this.state.completedUnits}</Text>
      <Text>totalUnits: {this.state.totalUnits}</Text>
      <Text>fractionCompleted: {this.state.fractionCompleted}</Text>
      <Text onPress={this.initS3.bind(this)}>Initialize your S3 Instance!</Text>
      <Text onPress={this.downloadObject.bind(this)}>Get that object!</Text>
      <Text onPress={this.uploadObject.bind(this)}>Upload that object!</Text>
      <Text onPress={this.pause.bind(this)}>Pause your event!</Text>
      <Text onPress={this.resume.bind(this)}>Resume your events!</Text>
      <Text onPress={this.cancel.bind(this)}>Cancel your events!</Text>
      </View>
    );
  }
}
module.exports = TransferUtility
