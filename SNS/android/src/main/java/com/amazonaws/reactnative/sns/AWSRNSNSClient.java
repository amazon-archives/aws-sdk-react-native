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

package com.amazonaws.reactnative.sns;

import com.amazonaws.reactnative.core.AWSRNClientConfiguration;
import com.amazonaws.reactnative.core.AWSRNClientMarshaller;
import com.amazonaws.reactnative.core.AWSRNCognitoCredentials;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.sns.*;
import com.amazonaws.services.sns.model.*;
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

import java.nio.ByteBuffer;


public class AWSRNSNSClient extends ReactContextBaseJavaModule {

    private AmazonSNSClient snsClient;
    private Gson gson;

    public AWSRNSNSClient(final ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "AWSRNSNSClient";
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
        snsClient = new AmazonSNSClient(credentials.getCredentialsProvider(), new AWSRNClientConfiguration().withUserAgent("SNS"));
        snsClient.setRegion(Region.getRegion(Regions.fromName(options.getString("region"))));
    }

    @ReactMethod
    public void ListSubscriptionsByTopic(final ReadableMap options, final Promise promise) {
        try {
            final ListSubscriptionsByTopicRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), ListSubscriptionsByTopicRequest.class);
            final ListSubscriptionsByTopicResult response = snsClient.listSubscriptionsByTopic(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void Subscribe(final ReadableMap options, final Promise promise) {
        try {
            final SubscribeRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), SubscribeRequest.class);
            final SubscribeResult response = snsClient.subscribe(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void GetTopicAttributes(final ReadableMap options, final Promise promise) {
        try {
            final GetTopicAttributesRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), GetTopicAttributesRequest.class);
            final GetTopicAttributesResult response = snsClient.getTopicAttributes(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void AddPermission(final ReadableMap options, final Promise promise) {
        try {
            final AddPermissionRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), AddPermissionRequest.class);
            snsClient.addPermission(request);
            promise.resolve(Arguments.createMap());
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void GetPlatformApplicationAttributes(final ReadableMap options, final Promise promise) {
        try {
            final GetPlatformApplicationAttributesRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), GetPlatformApplicationAttributesRequest.class);
            final GetPlatformApplicationAttributesResult response = snsClient.getPlatformApplicationAttributes(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void CreatePlatformEndpoint(final ReadableMap options, final Promise promise) {
        try {
            final CreatePlatformEndpointRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), CreatePlatformEndpointRequest.class);
            final CreatePlatformEndpointResult response = snsClient.createPlatformEndpoint(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void DeletePlatformApplication(final ReadableMap options, final Promise promise) {
        try {
            final DeletePlatformApplicationRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), DeletePlatformApplicationRequest.class);
            snsClient.deletePlatformApplication(request);
            promise.resolve(Arguments.createMap());
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void Unsubscribe(final ReadableMap options, final Promise promise) {
        try {
            final UnsubscribeRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), UnsubscribeRequest.class);
            snsClient.unsubscribe(request);
            promise.resolve(Arguments.createMap());
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void SetSubscriptionAttributes(final ReadableMap options, final Promise promise) {
        try {
            final SetSubscriptionAttributesRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), SetSubscriptionAttributesRequest.class);
            snsClient.setSubscriptionAttributes(request);
            promise.resolve(Arguments.createMap());
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void ListEndpointsByPlatformApplication(final ReadableMap options, final Promise promise) {
        try {
            final ListEndpointsByPlatformApplicationRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), ListEndpointsByPlatformApplicationRequest.class);
            final ListEndpointsByPlatformApplicationResult response = snsClient.listEndpointsByPlatformApplication(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void ListSubscriptions(final ReadableMap options, final Promise promise) {
        try {
            final ListSubscriptionsRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), ListSubscriptionsRequest.class);
            final ListSubscriptionsResult response = snsClient.listSubscriptions(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void SetTopicAttributes(final ReadableMap options, final Promise promise) {
        try {
            final SetTopicAttributesRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), SetTopicAttributesRequest.class);
            snsClient.setTopicAttributes(request);
            promise.resolve(Arguments.createMap());
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void GetEndpointAttributes(final ReadableMap options, final Promise promise) {
        try {
            final GetEndpointAttributesRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), GetEndpointAttributesRequest.class);
            final GetEndpointAttributesResult response = snsClient.getEndpointAttributes(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void DeleteTopic(final ReadableMap options, final Promise promise) {
        try {
            final DeleteTopicRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), DeleteTopicRequest.class);
            snsClient.deleteTopic(request);
            promise.resolve(Arguments.createMap());
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void SetEndpointAttributes(final ReadableMap options, final Promise promise) {
        try {
            final SetEndpointAttributesRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), SetEndpointAttributesRequest.class);
            snsClient.setEndpointAttributes(request);
            promise.resolve(Arguments.createMap());
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void CreatePlatformApplication(final ReadableMap options, final Promise promise) {
        try {
            final CreatePlatformApplicationRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), CreatePlatformApplicationRequest.class);
            final CreatePlatformApplicationResult response = snsClient.createPlatformApplication(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void CreateTopic(final ReadableMap options, final Promise promise) {
        try {
            final CreateTopicRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), CreateTopicRequest.class);
            final CreateTopicResult response = snsClient.createTopic(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void DeleteEndpoint(final ReadableMap options, final Promise promise) {
        try {
            final DeleteEndpointRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), DeleteEndpointRequest.class);
            snsClient.deleteEndpoint(request);
            promise.resolve(Arguments.createMap());
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void GetSubscriptionAttributes(final ReadableMap options, final Promise promise) {
        try {
            final GetSubscriptionAttributesRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), GetSubscriptionAttributesRequest.class);
            final GetSubscriptionAttributesResult response = snsClient.getSubscriptionAttributes(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void Publish(final ReadableMap options, final Promise promise) {
        try {
            final PublishRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), PublishRequest.class);
            final PublishResult response = snsClient.publish(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void ListTopics(final ReadableMap options, final Promise promise) {
        try {
            final ListTopicsRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), ListTopicsRequest.class);
            final ListTopicsResult response = snsClient.listTopics(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void ConfirmSubscription(final ReadableMap options, final Promise promise) {
        try {
            final ConfirmSubscriptionRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), ConfirmSubscriptionRequest.class);
            final ConfirmSubscriptionResult response = snsClient.confirmSubscription(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void RemovePermission(final ReadableMap options, final Promise promise) {
        try {
            final RemovePermissionRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), RemovePermissionRequest.class);
            snsClient.removePermission(request);
            promise.resolve(Arguments.createMap());
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void SetPlatformApplicationAttributes(final ReadableMap options, final Promise promise) {
        try {
            final SetPlatformApplicationAttributesRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), SetPlatformApplicationAttributesRequest.class);
            snsClient.setPlatformApplicationAttributes(request);
            promise.resolve(Arguments.createMap());
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

    @ReactMethod
    public void ListPlatformApplications(final ReadableMap options, final Promise promise) {
        try {
            final ListPlatformApplicationsRequest request = gson.fromJson(new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(), ListPlatformApplicationsRequest.class);
            final ListPlatformApplicationsResult response = snsClient.listPlatformApplications(request);
            final WritableMap map = AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
            promise.resolve(map);
        } catch (Exception e) {
            promise.reject(e);
            return;
        }
    }

}
