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

package com.amazonaws.reactnative.s3;

import android.os.Environment;
import android.support.annotation.Nullable;
import android.util.Log;

import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferListener;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferObserver;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferState;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferType;
import com.amazonaws.mobileconnectors.s3.transferutility.TransferUtility;
import com.amazonaws.reactnative.core.AWSRNClientConfiguration;
import com.amazonaws.reactnative.core.AWSRNCognitoCredentials;
import com.amazonaws.regions.Region;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3Client;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

import java.io.File;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

public class AWSRNS3TransferUtility extends ReactContextBaseJavaModule {
    private TransferUtility transferUtility;
    private static final Map<String, Map<String, Object>> requestMap = new ConcurrentHashMap<>();
    private static final Map<Integer, String> transferIDMap = new ConcurrentHashMap<>();
    private static final String REQUESTID = "requestid";
    private static final String TRANSFERID = "transferid";
    private static final String BUCKET = "bucket";
    private static final String KEY = "key";
    private static final String PATH = "path";
    private static final String SUBSCRIBE = "subscribe";
    private static final String COMPLETIONHANDLER = "completionhandler";
    private static final String TYPE = "type";
    private static final String UPLOAD = "upload";
    private static final String DOWNLOAD = "download";
    private static final String REQUEST = "request";
    private static final String CONFIG = "config";
    private static final String OPTION = "option";
    private static final String PAUSE = "pause";
    private static final String RESUME = "resume";
    private static final String CANCEL = "cancel";
    private static final String ALL = "all";
    private static final String ERROR = "error";
    private static final String REGION = "region";
    private static final String COMPLETEDUNITCOUNT = "completedunitcount";
    private static final String TOTALUNITCOUNT = "totalunitcount";
    private static final String FRACTIONCOMPLETED = "fractioncompleted";
    private static final String DESCRIPTION = "description";
    private static final String CODE = "code";
    private static final String LOCATION = "location";

    public AWSRNS3TransferUtility(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AWSRNS3TransferUtility";
    }

    @ReactMethod
    public void initWithOptions(final ReadableMap options) {
        if (!options.hasKey(REGION)) {
            throw new IllegalArgumentException("region not supplied");
        }
        final AWSRNCognitoCredentials credentials = this.getReactApplicationContext().getNativeModule(AWSRNCognitoCredentials.class);
        if (credentials.getCredentialsProvider() == null) {
            throw new IllegalArgumentException("AWSCognitoCredentials is not initialized");
        }
        final AmazonS3 s3 = new AmazonS3Client(credentials.getCredentialsProvider(), new AWSRNClientConfiguration().withUserAgent("AWSS3TransferUtility"));
        s3.setRegion(Region.getRegion(Regions.fromName(options.getString(REGION))));
        transferUtility = new TransferUtility(s3, getReactApplicationContext());
    }

    @ReactMethod
    public void createDownloadRequest(final ReadableMap options, final Callback callback) {
        if (requestMap == null) {
            callback.invoke("Error: AWSS3TransferUtility is not initialized", null);
            return;
        }
        final String[] params = {BUCKET, KEY, PATH, SUBSCRIBE, COMPLETIONHANDLER};
        for (int i = 0; i < params.length; i++) {
            if (!options.hasKey(params[i])) {
                callback.invoke(params[i] + " is not supplied", null);
                return;
            }
        }
        final Map<String, Object> map = new ConcurrentHashMap<>();
        map.put(BUCKET, options.getString(BUCKET));
        map.put(KEY, options.getString(KEY));
        map.put(PATH, Environment.getExternalStorageDirectory() + options.getString(PATH));
        map.put(TYPE, DOWNLOAD);
        map.put(SUBSCRIBE, options.getBoolean(SUBSCRIBE));
        map.put(COMPLETIONHANDLER, options.getBoolean(COMPLETIONHANDLER));
        final UUID uuid = UUID.randomUUID();
        requestMap.put(uuid.toString(), map);
        callback.invoke(null, uuid.toString());
    }

    @ReactMethod
    public void download(final ReadableMap options, final Promise promise) {
        if (!options.hasKey(REQUESTID)) {
            throw new IllegalArgumentException("requestid is not supplied");
        }
        final String requestID = options.getString(REQUESTID);
        final Map<String, Object> map = requestMap.get(requestID);
        if (map == null) {
            throw new IllegalArgumentException("requestid is invalid");
        }
        final TransferObserver observer;
        try {
            observer = transferUtility.download(
                    (String) map.get(BUCKET),
                    (String) map.get(KEY),
                    new File((String) map.get(PATH))
            );
        } catch (final AmazonServiceException e) {
            promise.reject(e.getErrorCode(), e.getErrorMessage(), e);
            return;
        } catch (final AmazonClientException e) {
            promise.reject("", e.getMessage(), e);
            return;
        }
        transferIDMap.put(observer.getId(), requestID);
        map.put(TRANSFERID, observer.getId());
        if ((Boolean) map.get(SUBSCRIBE)) {
            this.subscribe(observer);
        }
        promise.resolve("success");
    }

    @ReactMethod
    public void createUploadRequest(final ReadableMap options, final Callback callback) {
        if (requestMap == null) {
            callback.invoke("Error: AWSS3TransferUtility is not initialized", null);
            return;
        }
        final String[] params = {BUCKET, KEY, PATH, SUBSCRIBE, COMPLETIONHANDLER};
        for (int i = 0; i < params.length; i++) {
            if (!options.hasKey(params[i])) {
                callback.invoke(params[i] + " is not supplied", null);
                return;
            }
        }
        final Map<String, Object> map = new ConcurrentHashMap<>();
        map.put(BUCKET, options.getString(BUCKET));
        map.put(KEY, options.getString(KEY));
        map.put(PATH, options.getString(PATH));
        map.put(SUBSCRIBE, options.getBoolean(SUBSCRIBE));
        map.put(COMPLETIONHANDLER, options.getBoolean(COMPLETIONHANDLER));
        map.put(TYPE, UPLOAD);
        final UUID uuid = UUID.randomUUID();
        requestMap.put(uuid.toString(), map);
        callback.invoke(null, uuid.toString());
    }

    @ReactMethod
    public void upload(final ReadableMap options, final Promise promise) {
        if (!options.hasKey(REQUESTID)) {
            throw new IllegalArgumentException("requestid is not supplied");
        }
        final String requestID = options.getString(REQUESTID);
        final Map<String, Object> map = requestMap.get(requestID);
        if (map == null) {
            throw new IllegalArgumentException("requestid is invalid");
        }
        final TransferObserver observer;
        try {
            observer = transferUtility.upload(
                    (String) map.get(BUCKET),
                    (String) map.get(KEY),
                    new File((String) map.get(PATH))
            );
        } catch (final AmazonServiceException e) {
            promise.reject(e.getErrorCode(), e.getErrorMessage(), e);
            return;
        } catch (final AmazonClientException e) {
            promise.reject("", e.getMessage(), e);
            return;
        }
        transferIDMap.put(observer.getId(), requestID);
        map.put(TRANSFERID, observer.getId());
        if ((Boolean) map.get(SUBSCRIBE)) {
            this.subscribe(observer);
        }
        promise.resolve("success");
    }

    @ReactMethod
    public void editRequest(final ReadableMap options) {
        if (!options.hasKey(CONFIG)) {
            throw new IllegalArgumentException("config not supplied");
        }
        final String config = options.getString(CONFIG);
        String option = null;
        if (options.hasKey(OPTION)) {
            option = options.getString(OPTION);
        }
        String request = null;
        if (options.hasKey(REQUEST)) {
            request = options.getString(REQUEST);
        }
        if (option == null && request == null) {
            throw new IllegalArgumentException("request and option not supplied. Please supply one");
        }
        if (option != null && request != null) {
            throw new IllegalArgumentException("request and option are both supplied. Please only supply one");
        }
        if (config.contentEquals(PAUSE)) {
            this.pause(request, option);
        } else if (config.contentEquals(RESUME)) {
            this.resume(request, option);
        } else if (config.contentEquals(CANCEL)) {
            this.cancel(request, option);
        }
    }

    public void pause(final String request, final String option) {
        if (request != null) {
            final Map<String, Object> req = requestMap.get(request);
            if (req == null) {
                Log.w(this.getClass().toString(), "Pause: request is invalid");
                return;
            }
            final int id = (int) req.get(TRANSFERID);
            try {
                transferUtility.pause(id);
            } catch (final AmazonClientException e) {
                throw e;
            }
        } else {
            if (option.contentEquals(ALL)) {
                try {
                    transferUtility.pauseAllWithType(TransferType.ANY);
                } catch (final AmazonClientException e) {
                    throw e;
                }
            } else if (option.contentEquals(UPLOAD)) {
                try {
                    transferUtility.pauseAllWithType(TransferType.UPLOAD);
                } catch (final AmazonClientException e) {
                    throw e;
                }
            } else if (option.contentEquals(DOWNLOAD)) {
                try {
                    transferUtility.pauseAllWithType(TransferType.DOWNLOAD);
                } catch (final AmazonClientException e) {
                    throw e;
                }
            }
        }
    }

    public void resume(final String request, final String option) {
        if (request != null) {
            Map<String, Object> req = requestMap.get(request);
            if (req == null) {
                Log.w(this.getClass().toString(), "Resume: request is invalid");
                return;
            }
            int id = (int) req.get(TRANSFERID);
            try {
                transferUtility.resume(id);
            } catch (final AmazonClientException e) {
                throw e;
            }
        } else {
            if (option.contentEquals(ALL)) {
                List<TransferObserver> list = null;
                try {
                    list = transferUtility.getTransfersWithTypeAndState(TransferType.ANY, TransferState.PAUSED);
                } catch (final AmazonClientException e) {
                    throw e;
                }
                for (TransferObserver observer : list) {
                    try {
                        transferUtility.resume(observer.getId());
                    } catch (final AmazonClientException e) {
                        throw e;
                    }
                }
            } else if (option.contentEquals(UPLOAD)) {
                List<TransferObserver> list = null;
                try {
                    list = transferUtility.getTransfersWithTypeAndState(TransferType.UPLOAD, TransferState.PAUSED);
                } catch (final AmazonClientException e) {
                    throw e;
                }
                for (TransferObserver observer : list) {
                    try {
                        transferUtility.resume(observer.getId());
                    } catch (final AmazonClientException e) {
                        throw e;
                    }
                }
            } else if (option.contentEquals(DOWNLOAD)) {
                List<TransferObserver> list = null;
                try {
                    list = transferUtility.getTransfersWithTypeAndState(TransferType.DOWNLOAD, TransferState.PAUSED);
                } catch (final AmazonClientException e) {
                    throw e;
                }
                for (TransferObserver observer : list) {
                    try {
                        transferUtility.resume(observer.getId());
                    } catch (final AmazonClientException e) {
                        throw e;
                    }
                }
            }
        }
    }

    public void cancel(final String request, final String option) {
        if (request != null) {
            Map<String, Object> req = requestMap.get(request);
            if (req == null) {
                Log.w(this.getClass().toString(), "Cancel: request is invalid");
                return;
            }
            int transferid = (int) req.get(TRANSFERID);
            try {
                transferUtility.cancel(transferid);
            } catch (final AmazonClientException e) {
                throw e;
            }
            this.removeTransferFromMap(request, transferid);
        } else {
            if (option.contentEquals(ALL)) {
                try {
                    transferUtility.cancelAllWithType(TransferType.ANY);
                } catch (final AmazonClientException e) {
                    throw e;
                }
                requestMap.clear();
            } else if (option.contentEquals(UPLOAD)) {
                try {
                    transferUtility.cancelAllWithType(TransferType.UPLOAD);
                } catch (final AmazonClientException e) {
                    throw e;
                }
                removeTransfers(UPLOAD);
            } else if (option.contentEquals(DOWNLOAD)) {
                try {
                    transferUtility.cancelAllWithType(TransferType.DOWNLOAD);
                } catch (final AmazonClientException e) {
                    throw e;
                }
                removeTransfers(DOWNLOAD);
            }
        }
    }

    private void removeTransfers(final String type) {
        final Iterator it = requestMap.entrySet().iterator();
        while (it.hasNext()) {
            final Map.Entry pair = (Map.Entry) it.next();
            if (pair == null) {
                return;
            }
            final Map<String, Object> map = (Map<String, Object>) pair.getValue();
            final String reqType = (String) map.get(TYPE);
            if (reqType.contentEquals(type)) {
                this.removeTransferFromMap((String) pair.getKey(), (int) map.get(TRANSFERID));
            }
        }
    }

    private void subscribe(TransferObserver observer) {
        observer.setTransferListener(new TransferListener() {
            @Override
            public void onStateChanged(final int id, final TransferState state) {
                final WritableMap map = Arguments.createMap();
                final String uuid = transferIDMap.get(id);
                final Map<String, Object> req = requestMap.get(uuid);
                if (!(boolean) req.get(COMPLETIONHANDLER)) {
                    return;
                }
                map.putString(REQUESTID, uuid);
                if (state == TransferState.CANCELED) {
                    map.putString(ERROR, "canceled");
                } else if (state == TransferState.FAILED) {
                    map.putString(ERROR, "failed");
                } else if (state == TransferState.COMPLETED) {
                    final WritableMap request = Arguments.createMap();
                    TransferObserver observer = null;
                    try {
                        observer = transferUtility.getTransferById(id);
                    } catch (final AmazonClientException e) {
                        throw e;
                    }
                    request.putString(BUCKET, observer.getBucket());
                    request.putString(KEY, observer.getKey());
                    request.putString(LOCATION, observer.getAbsoluteFilePath());
                    map.putMap(REQUEST, request);
                    removeTransferFromMap(uuid, id);
                }
                if ((state.equals(TransferState.CANCELED) || state.equals(TransferState.FAILED) || state.equals(TransferState.COMPLETED)) && (map.hasKey(ERROR) || map.hasKey(REQUEST))) {
                    sendEvent(getReactApplicationContext(), "CompletionHandlerEvent", map);
                }
            }

            @Override
            public void onProgressChanged(final int id, final long bytesCurrent, final long bytesTotal) {
                final WritableMap map = Arguments.createMap();
                final String uuid = transferIDMap.get(id);
                final Map<String, Object> req = requestMap.get(uuid);
                map.putString(TYPE, (String) req.get(TYPE));
                map.putString(REQUESTID, uuid);
                map.putDouble(COMPLETEDUNITCOUNT, (double) bytesCurrent);
                map.putDouble(TOTALUNITCOUNT, (double) bytesTotal);
                if (bytesTotal == 0) {
                    map.putDouble(FRACTIONCOMPLETED, 0);
                } else {
                    map.putDouble(FRACTIONCOMPLETED, ((double) bytesCurrent / (double) bytesTotal));
                }
                sendEvent(getReactApplicationContext(), "ProgressEventUtility", map);
            }

            @Override
            public void onError(final int id, final Exception ex) {
                final WritableMap map = Arguments.createMap();
                final WritableMap errorMap = Arguments.createMap();
                final String uuid = transferIDMap.get(id);
                map.putString(REQUESTID, uuid);
                errorMap.putString(ERROR, ex.toString());
                errorMap.putString(DESCRIPTION, ex.getLocalizedMessage());
                errorMap.putInt(CODE, ex.hashCode());
                map.putMap(ERROR, errorMap);
                sendEvent(getReactApplicationContext(), "ProgressEventUtility", map);
            }
        });
    }


    private void removeTransferFromMap(String uuid, int id) {
        if (requestMap.get(uuid) != null) {
            transferUtility.deleteTransferRecord(id);
            requestMap.remove(uuid);
        }
    }

    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }
}
