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
package com.amazonaws.reactnative.core;

import android.support.annotation.Nullable;

import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSCognitoIdentityProvider;
import com.amazonaws.auth.AWSSessionCredentials;
import com.amazonaws.auth.CognitoCachingCredentialsProvider;
import com.amazonaws.auth.IdentityChangedListener;
import com.amazonaws.regions.Regions;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.util.HashMap;
import java.util.Map;

public class AWSRNCognitoCredentials extends ReactContextBaseJavaModule {

    private static final String IDENTITY_POOL_ID = "identity_pool_id";
    private static final String REGION = "region";
    private static final String SERVICE_NAME = "AWSCognitoCredentials";
    private static final String CURRENT = "current";
    private static final String PREVIOUS = "previous";
    private static final String IDENTITYCHANGE = "IdentityChange";
    private static final String IDENTITYID = "identityid";
    private static final String ACCESS_KEY = "AccessKey";
    private static final String SESSION_KEY = "SessionKey";
    private static final String SECRET_KEY = "SecretKey";
    private static final String EXPIRATION = "Expiration";
    private static final String RNFACEBOOKPROVIDER = "FacebookProvider";
    private static final String FACEBOOKPROVIDER = "graph.facebook.com";
    private static final String RNAMAZONPROVIDER = "AmazonProvider";
    private static final String AMAZONPROVIDER = "www.amazon.com";
    private static final String RNGOOGLEPROVIDER = "GoogleProvider";
    private static final String GOOGLEPROVIDER = "accounts.google.com";
    private static final String RNTWITTERPROVIDER = "TwitterProvider";
    private static final String TWITTERPROVIDER = "api.twitter.com";
    private static final String RNDIGITSPROVIDER = "DigitsProvider";
    private static final String DIGITSPROVIDER = "www.digits.com";
    private CognitoCachingCredentialsProvider credentialsProvider;

    private final BackgroundRunner backgroundRunner = new BackgroundRunner();

    public AWSRNCognitoCredentials(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AWSRNCognitoCredentials";
    }

    @ReactMethod
    public void initWithOptions(final ReadableMap options) throws IllegalArgumentException {
        if (!options.hasKey(IDENTITY_POOL_ID) || !options.hasKey(REGION)) {
            throw new IllegalArgumentException("identity_pool_id and/or region not supplied");
        } else {
            credentialsProvider = new CognitoCachingCredentialsProvider(
                    getReactApplicationContext(),
                    options.getString(IDENTITY_POOL_ID),
                    Regions.fromName(options.getString(REGION)),
                    new AWSRNClientConfiguration().withUserAgent(SERVICE_NAME)
            );
            credentialsProvider.registerIdentityChangedListener(new IdentityChangedListener() {
                @Override
                public void identityChanged(final String oldidentityid, final String newidentityid) {
                    final WritableMap params = Arguments.createMap();
                    params.putString(CURRENT, newidentityid);
                    params.putString(PREVIOUS, oldidentityid);
                    sendEvent(getReactApplicationContext(), IDENTITYCHANGE, params);
                }
            });
        }
    }

    @ReactMethod
    public void setLogins(final ReadableMap logins) {
        final Map<String, String> userLogins = new HashMap<String, String>();
        final ReadableMapKeySetIterator loginsIterable = logins.keySetIterator();
        while (loginsIterable.hasNextKey()) {
            final String key = loginsIterable.nextKey();
            userLogins.put(keyConverter(key), logins.getString(key));
        }
        if (userLogins.size() != 0) {
            credentialsProvider.setLogins(userLogins);
        }
    }

    @ReactMethod
    public void getIdentityIDAsync(final Promise promise) {
        backgroundRunner.runInBackground(
            new BackgroundRunner.Supplier<WritableMap>() {
                @Override
                public WritableMap get() throws Exception {
                    final String identityId = credentialsProvider.getIdentityId();
                    if (identityId != null) {
                        final WritableMap identityidMap = Arguments.createMap();
                        identityidMap.putString(IDENTITYID, identityId);
                        return identityidMap;
                    }
                    else {
                        // TODO: throw exception instead?
                        return null;
                    }
                }
            },
            PROMISE_REJECTOR,
            promise
        );
    }

    @ReactMethod
    public void getCredentialsAsync(final Promise promise) {
        backgroundRunner.runInBackground(
            new BackgroundRunner.Supplier<WritableMap>() {
                @Override
                public WritableMap get() throws Exception {
                    final AWSSessionCredentials cred = credentialsProvider.getCredentials();
                    if (cred != null) {
                        final WritableMap credentials = Arguments.createMap();
                        credentials.putString(ACCESS_KEY, cred.getAWSAccessKeyId());
                        credentials.putString(SESSION_KEY, cred.getSessionToken());
                        credentials.putString(SECRET_KEY, cred.getAWSSecretKey());
                        credentials.putString(EXPIRATION, credentialsProvider.getSessionCredentitalsExpiration().toString());
                        return credentials;
                    }
                    else {
                        // TODO: throw exception instead?
                        return null;
                    }
                }
            },
            PROMISE_REJECTOR,
            promise
        );
    }

    @ReactMethod
    public void isAuthenticated(final Callback callback) {
        try {
            final AWSCognitoIdentityProvider identity = (AWSCognitoIdentityProvider) credentialsProvider.getIdentityProvider();
            callback.invoke(null, identity.isAuthenticated());
        } catch (AmazonServiceException e) {
            callback.invoke(e, e.getErrorMessage());
        } catch (AmazonClientException e) {
            callback.invoke(e, e.getMessage());
        }
    }

    @ReactMethod
    public void clearCredentials() {
        credentialsProvider.clearCredentials();
    }

    @ReactMethod
    public void clear() {
        credentialsProvider.clear();
    }

    public CognitoCachingCredentialsProvider getCredentialsProvider() {
        return credentialsProvider;
    }

    private void sendEvent(final ReactContext reactContext,
                           final String eventName,
                           final @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    private String keyConverter(final String key) {
        switch (key) {
            case RNFACEBOOKPROVIDER:
                return FACEBOOKPROVIDER;
            case RNAMAZONPROVIDER:
                return AMAZONPROVIDER;
            case RNGOOGLEPROVIDER:
                return GOOGLEPROVIDER;
            case RNTWITTERPROVIDER:
                return TWITTERPROVIDER;
            case RNDIGITSPROVIDER:
                return DIGITSPROVIDER;
            default:
                return key;
        }
    }

    private static final BackgroundRunner.PromiseRejector PROMISE_REJECTOR = new BackgroundRunner.PromiseRejector() {
        @Override
        public void reject(Exception e, Promise promise) {
            if(e instanceof AmazonServiceException) {
                AmazonServiceException ase = (AmazonServiceException)e;
                promise.reject(ase.getErrorCode(), ase.getErrorMessage(), e);
            }
            else {
                promise.reject("", e.getMessage(), e);
            }
        }
    };

}
