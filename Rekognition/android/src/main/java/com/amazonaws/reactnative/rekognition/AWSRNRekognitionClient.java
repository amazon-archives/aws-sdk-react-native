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

package com.amazonaws.reactnative.rekognition;

import android.util.Log;

import com.amazonaws.reactnative.core.AWSRNClientConfiguration;
import com.amazonaws.reactnative.core.AWSRNClientMarshaller;
import com.amazonaws.reactnative.core.AWSRNCognitoCredentials;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.rekognition.*;
import com.amazonaws.services.rekognition.model.*;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.FieldNamingPolicy;
import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import org.json.JSONObject;

import java.io.IOException;
import java.io.RandomAccessFile;

import java.nio.ByteBuffer;
import java.nio.MappedByteBuffer;

import java.nio.channels.FileChannel;

public class AWSRNRekognitionClient extends ReactContextBaseJavaModule {

    private AmazonRekognitionClient rekognitionClient;
    private Gson gson;

    public AWSRNRekognitionClient(final ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "AWSRNRekognitionClient";
    }

    @ReactMethod
    public void initWithOptions(final ReadableMap options) {
        final AWSRNCognitoCredentials credentials = this.getReactApplicationContext().getNativeModule(AWSRNCognitoCredentials.class);
        if (credentials.getCredentialsProvider() == null) {
            throw new IllegalArgumentException("AWSCognitoCredentials is not initialized");
        }
        gson = new GsonBuilder().setFieldNamingStrategy(FieldNamingPolicy.UPPER_CAMEL_CASE).registerTypeAdapter(ByteBuffer.class, AWSRNClientMarshaller.getSerializer()).registerTypeAdapter(ByteBuffer.class, AWSRNClientMarshaller.getDeserializer()).create();
        rekognitionClient = new AmazonRekognitionClient(credentials.getCredentialsProvider(), new AWSRNClientConfiguration().withUserAgent("Rekognition"));
    }

    @ReactMethod
    public void CompareFaces(final ReadableMap options, final Promise promise) {
        try {
            final CompareFacesRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), CompareFacesRequest.class);
            final CompareFacesResult response = rekognitionClient.compareFaces(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void CreateCollection(final ReadableMap options, final Promise promise) {
        try {
            final CreateCollectionRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), CreateCollectionRequest.class);
            final CreateCollectionResult response = rekognitionClient.createCollection(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void DeleteCollection(final ReadableMap options, final Promise promise) {
        try {
            final DeleteCollectionRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), DeleteCollectionRequest.class);
            final DeleteCollectionResult response = rekognitionClient.deleteCollection(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void DeleteFaces(final ReadableMap options, final Promise promise) {
        try {
            final DeleteFacesRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), DeleteFacesRequest.class);
            final DeleteFacesResult response = rekognitionClient.deleteFaces(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void DetectFaces(final ReadableMap options, final Promise promise) {
        try {
            final DetectFacesRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), DetectFacesRequest.class);
            final DetectFacesResult response = rekognitionClient.detectFaces(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void DetectLabels(final ReadableMap options, final Promise promise) {
        try {
            final DetectLabelsRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), DetectLabelsRequest.class);
            final DetectLabelsResult response = rekognitionClient.detectLabels(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void IndexFaces(final ReadableMap options, final Promise promise) {
        try {
            final IndexFacesRequest request = new IndexFacesRequest();
            request.setCollectionId(options.getString("CollectionId"));
            try {
              RandomAccessFile file = new RandomAccessFile(options.getString("File"), "r");
              FileChannel inChannel = file.getChannel();
              MappedByteBuffer buffer = inChannel.map(FileChannel.MapMode.READ_ONLY, 0, inChannel.size());
              final Image image = new Image();
              image.withBytes(buffer);
              request.setImage(image);
            } catch(IOException e) {
              Log.w(this.getClass().toString(), e.getMessage());
            }

            final IndexFacesResult response = rekognitionClient.indexFaces(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void ListCollections(final ReadableMap options, final Promise promise) {
        try {
            final ListCollectionsRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), ListCollectionsRequest.class);
            final ListCollectionsResult response = rekognitionClient.listCollections(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void ListFaces(final ReadableMap options, final Promise promise) {
        try {
            final ListFacesRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), ListFacesRequest.class);
            final ListFacesResult response = rekognitionClient.listFaces(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void SearchFaces(final ReadableMap options, final Promise promise) {
        try {
            final SearchFacesRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), SearchFacesRequest.class);
            final SearchFacesResult response = rekognitionClient.searchFaces(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void SearchFacesByImage(final ReadableMap options, final Promise promise) {
        try {
            final SearchFacesByImageRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), SearchFacesByImageRequest.class);
            final SearchFacesByImageResult response = rekognitionClient.searchFacesByImage(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

}
