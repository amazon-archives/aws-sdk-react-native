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

package com.integrationtests;

import android.support.annotation.Nullable;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

public class AWSRNTestExecutor extends ReactContextBaseJavaModule {
    private static ReactApplicationContext context;
    public boolean testFailed;
    public boolean testCompleted;

    public static AWSRNTestExecutor getInstance() {
        if (context == null) {
            return null;
        }
        return (AWSRNTestExecutor) context.getNativeModule(AWSRNTestExecutor.class);
    }

    public AWSRNTestExecutor(ReactApplicationContext reactContext) {
        super(reactContext);
        context = reactContext;
    }

    @Override
    public String getName() {
        return "AWSRNTestExecutor";
    }

    public void sendEvent(String eventName, @Nullable WritableMap params) {
        context.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    @ReactMethod
    public void testUpdateStatus(final ReadableMap options) throws RuntimeException {
        testCompleted = true;
        if(options.getBoolean("isFailed")){
            testFailed = true;
            throw new RuntimeException("Test failed: " + options.toString());
        }
    }

    public void resetTest(){
        testCompleted = false;
        testFailed = false;
    }
}