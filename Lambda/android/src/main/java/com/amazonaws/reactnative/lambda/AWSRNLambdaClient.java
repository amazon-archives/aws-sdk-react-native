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

package com.amazonaws.reactnative.lambda;

import com.amazonaws.reactnative.core.AWSRNClientConfiguration;
import com.amazonaws.reactnative.core.AWSRNClientMarshaller;
import com.amazonaws.reactnative.core.AWSRNCognitoCredentials;
import com.amazonaws.reactnative.core.BackgroundRunner;
import com.amazonaws.reactnative.core.BackgroundRunner.Supplier;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.lambda.*;
import com.amazonaws.services.lambda.model.*;
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

public class AWSRNLambdaClient extends ReactContextBaseJavaModule {

    private AWSLambdaClient lambdaClient;
    private Gson gson;

    private final BackgroundRunner backgroundRunner = new BackgroundRunner();

    public AWSRNLambdaClient(final ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "AWSRNLambdaClient";
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
        lambdaClient = new AWSLambdaClient(credentials.getCredentialsProvider(), new AWSRNClientConfiguration().withUserAgent("Lambda"));
        lambdaClient.setRegion(Region.getRegion(Regions.fromName(options.getString("region"))));
    }

    @ReactMethod
    public void Invoke(final ReadableMap options, final Promise promise) {
        backgroundRunner.runInBackground(
            new Supplier<WritableMap>() {
                @Override
                public WritableMap get() throws Exception {
                    final InvokeRequest request = gson.fromJson(
                        new JSONObject(AWSRNClientMarshaller.readableMapToMap(options)).toString(),
                        InvokeRequest.class
                    );
                    final InvokeResult response = lambdaClient.invoke(request);
                    return AWSRNClientMarshaller.jsonToReact(new JSONObject(gson.toJson(response)));
                }
            },
            promise
        );
    }

}
