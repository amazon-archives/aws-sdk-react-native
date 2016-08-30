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

package com.amazonaws.reactnative.dynamodb;

import com.amazonaws.reactnative.core.AWSRNClientMarshaller;
import com.amazonaws.reactnative.core.AWSRNClientConfiguration;
import com.amazonaws.reactnative.core.AWSRNCognitoCredentials;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.dynamodbv2.*;
import com.amazonaws.services.dynamodbv2.model.*;

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

import java.nio.ByteBuffer;

public class AWSRNDynamoDBClient extends ReactContextBaseJavaModule {
    
    private AmazonDynamoDBClient dynamodbClient;
    private Gson gson;
    
    public AWSRNDynamoDBClient(final ReactApplicationContext context) {
        super(context);
    }
    
    @Override
    public String getName() {
        return "AWSRNDynamoDBClient";
    }
    
    @ReactMethod
    public void initWithOptions(final ReadableMap options) {
        if (!options.hasKey("region")) {
            throw new IllegalArgumentException("expected region key");
        }
        final AWSRNCognitoCredentials credentials = this.getReactApplicationContext().getNativeModule(AWSRNCognitoCredentials.class);
        if (credentials.getCredentialsProvider() == null) {
            throw new IllegalArgumentException("AWSCognitoCredentials is not initialized");
        }
        gson = new GsonBuilder().setFieldNamingStrategy(FieldNamingPolicy.UPPER_CAMEL_CASE).registerTypeAdapter(ByteBuffer.class, AWSRNClientMarshaller.getSerializer()).registerTypeAdapter(ByteBuffer.class, AWSRNClientMarshaller.getDeserializer()).create();
        dynamodbClient = new AmazonDynamoDBClient(credentials.getCredentialsProvider(), new AWSRNClientConfiguration().withUserAgent("DynamoDB"));
        dynamodbClient.setRegion(Region.getRegion(Regions.fromName(options.getString("region"))));
    }
    
    @ReactMethod
    public void DeleteTable(final ReadableMap options, final Promise promise) {
        try {
            final DeleteTableRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), DeleteTableRequest.class);
            final DeleteTableResult response = dynamodbClient.deleteTable(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }
    
    @ReactMethod
    public void BatchGetItem(final ReadableMap options, final Promise promise) {
        try {
            final BatchGetItemRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), BatchGetItemRequest.class);
            final BatchGetItemResult response = dynamodbClient.batchGetItem(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }
    
    @ReactMethod
    public void DescribeTable(final ReadableMap options, final Promise promise) {
        try {
            final DescribeTableRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), DescribeTableRequest.class);
            final DescribeTableResult response = dynamodbClient.describeTable(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }
    
    @ReactMethod
    public void PutItem(final ReadableMap options, final Promise promise) {
        try {
            final PutItemRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), PutItemRequest.class);
            final PutItemResult response = dynamodbClient.putItem(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }
    
    @ReactMethod
    public void Query(final ReadableMap options, final Promise promise) {
        try {
            final QueryRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), QueryRequest.class);
            final QueryResult response = dynamodbClient.query(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }
    
    @ReactMethod
    public void Scan(final ReadableMap options, final Promise promise) {
        try {
            final ScanRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), ScanRequest.class);
            final ScanResult response = dynamodbClient.scan(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }
    
    @ReactMethod
    public void DeleteItem(final ReadableMap options, final Promise promise) {
        try {
            final DeleteItemRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), DeleteItemRequest.class);
            final DeleteItemResult response = dynamodbClient.deleteItem(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }
    
    @ReactMethod
    public void UpdateItem(final ReadableMap options, final Promise promise) {
        try {
            final UpdateItemRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), UpdateItemRequest.class);
            final UpdateItemResult response = dynamodbClient.updateItem(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }
    
    @ReactMethod
    public void CreateTable(final ReadableMap options, final Promise promise) {
        try {
            final CreateTableRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), CreateTableRequest.class);
            final CreateTableResult response = dynamodbClient.createTable(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }
    
    @ReactMethod
    public void BatchWriteItem(final ReadableMap options, final Promise promise) {
        try {
            final BatchWriteItemRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), BatchWriteItemRequest.class);
            final BatchWriteItemResult response = dynamodbClient.batchWriteItem(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }
    
    @ReactMethod
    public void GetItem(final ReadableMap options, final Promise promise) {
        try {
            final GetItemRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), GetItemRequest.class);
            final GetItemResult response = dynamodbClient.getItem(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }
    
    @ReactMethod
    public void DescribeLimits(final ReadableMap options, final Promise promise) {
        try {
            final DescribeLimitsRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), DescribeLimitsRequest.class);
            final DescribeLimitsResult response = dynamodbClient.describeLimits(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }
    
    @ReactMethod
    public void ListTables(final ReadableMap options, final Promise promise) {
        try {
            final ListTablesRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), ListTablesRequest.class);
            final ListTablesResult response = dynamodbClient.listTables(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }
    
    @ReactMethod
    public void UpdateTable(final ReadableMap options, final Promise promise) {
        try {
            final UpdateTableRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), UpdateTableRequest.class);
            final UpdateTableResult response = dynamodbClient.updateTable(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }
    
}
