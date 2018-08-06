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
  * Compares a face in the source input image with each face detected in the
  * target input image.
  *
  * @param {map} compareFacesRequest - Input for CompareFaces action.
  */
  async CompareFaces(options){
    var returnValue = await RekognitionClient.CompareFaces(options);
    return returnValue;
  }

 /*
  * Creates a collection in an AWS region. You can add faces to the collection
  * using the operation.
  *
  * @param {map} CreateCollectionRequest - Input for CreateCollection action.
  */
  async CreateCollection(options){
    var returnValue = await RekognitionClient.CreateCollection(options);
    return returnValue;
  }

 /*
  * Deletes the specified collection. Note that this operation removes all
  * faces in the collection.
  *
  * @param {map} DeleteCollectionRequest - Input for DeleteCollection action.
  */
  async DeleteCollection(options){
    var returnValue = await RekognitionClient.DeleteCollection(options);
    return returnValue;
  }

 /*
  * Deletes faces from a collection. You specify a collection ID and an array
  * of face IDs to remove from the collection.
  *
  * @param {map} DeleteFacesRequest - Input for DeleteFaces action.
  */
  async DeleteFaces(options){
    var returnValue = await RekognitionClient.DeleteFaces(options);
    return returnValue;
  }

 /*
  * Detects faces within an image (JPEG or PNG) that is provided as input.
  *
  * @param {map} DetectFacesRequest - Input for DetectFaces action.
  */
  async DetectFaces(options){
    var returnValue = await RekognitionClient.DetectFaces(options);
    return returnValue;
  }

 /*
  * Detects instances of real-world labels within an image (JPEG or PNG)
  * provided as input.
  *
  * @param {map} DetectLabelsRequest - Input for CompareFaces action.
  */
  async DetectLabels(options){
    var returnValue = await RekognitionClient.DetectLabels(options);
    return returnValue;
  }

 /*
  * Detects faces in the input image and adds them to the specified collection.
  *
  * @param {map} IndexFacesRequest - Input for IndexFaces action.
  */
  async IndexFaces(options){
    var returnValue = await RekognitionClient.IndexFaces(options);
    return returnValue;
  }

 /*
  * Returns list of collection IDs in your account.
  *
  * @param {map} ListCollectionsRequest - Input for ListCollections action.
  */
  async ListCollections(options){
    var returnValue = await RekognitionClient.ListCollections(options);
    return returnValue;
  }

 /*
  * Returns metadata for faces in the specified collection.
  *
  * @param {map} ListFacesRequest - Input for ListFaces action.
  */
  async ListFaces(options){
    var returnValue = await RekognitionClient.ListFaces(options);
    return returnValue;
  }

 /*
  * For a given input face ID, searches the specified collection for matching
  * faces.
  *
  * @param {map} SearchFacesRequest - Input for SearchFaces action.
  */
  async SearchFaces(options){
    var returnValue = await RekognitionClient.SearchFaces(options);
    return returnValue;
  }

 /*
  * For a given input image, first detects the largest face in the image, and
  * then searches the specified collection for matching faces.
  *
  * @param {map} SearchFacesByImageRequest - Input for SearchFacesByImage action.
  */
  async SearchFacesByImage(options){
    var returnValue = await RekognitionClient.SearchFacesByImage(options);
    return returnValue;
  }

}
