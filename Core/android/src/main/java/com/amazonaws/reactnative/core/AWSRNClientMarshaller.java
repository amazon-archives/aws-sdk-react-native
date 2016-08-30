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

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.ReadableMapKeySetIterator;
import com.facebook.react.bridge.ReadableType;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.google.gson.JsonDeserializationContext;
import com.google.gson.JsonDeserializer;
import com.google.gson.JsonElement;
import com.google.gson.JsonParseException;
import com.google.gson.JsonPrimitive;
import com.google.gson.JsonSerializationContext;
import com.google.gson.JsonSerializer;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.lang.reflect.Type;
import java.nio.ByteBuffer;
import java.nio.charset.Charset;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;


public class AWSRNClientMarshaller {

    public static Serializer getSerializer() {
        return new Serializer();
    }

    public static Deserializer getDeserializer() {
        return new Deserializer();
    }

    public static Map<String, Object> readableMapToMap(final @Nullable ReadableMap readableMap) {
        if (readableMap == null) {
            return new HashMap<>();
        }

        final ReadableMapKeySetIterator iterator = readableMap.keySetIterator();
        if (!iterator.hasNextKey()) {
            return new HashMap<>();
        }

        final Map<String, Object> result = new HashMap<>();
        while (iterator.hasNextKey()) {
            final String key = iterator.nextKey();
            result.put(key, toObject(readableMap, key));
        }

        return result;
    }

    /**
     * toList converts a {@link ReadableArray} into an ArrayList.
     *
     * @param readableArray The ReadableArray to be conveted.
     * @return An ArrayList containing the data that was in the ReadableArray.
     */
    public static List<Object> readableArrayToList(final @Nullable ReadableArray readableArray) {
        if (readableArray == null) {
            return null;
        }

        List<Object> result = new ArrayList<>(readableArray.size());
        for (int index = 0; index < readableArray.size(); index++) {
            final ReadableType readableType = readableArray.getType(index);
            switch (readableType) {
                case Null:
                    result.add(String.valueOf(index));
                    break;
                case Boolean:
                    result.add(readableArray.getBoolean(index));
                    break;
                case Number:
                    // Can be int or double.
                    double tmp = readableArray.getDouble(index);
                    if (tmp == (int) tmp) {
                        result.add((int) tmp);
                    } else {
                        result.add(tmp);
                    }
                    break;
                case String:
                    result.add(readableArray.getString(index));
                    break;
                case Map:
                    result.add(readableMapToMap(readableArray.getMap(index)));
                    break;
                case Array:
                    result = readableArrayToList(readableArray.getArray(index));
                    break;
                default:
                    throw new IllegalArgumentException("Could not convert object with index: " + index + ".");
            }
        }

        return result;
    }

    public static Object toObject(@Nullable ReadableMap readableMap, String key) {
        if (readableMap == null) {
            return null;
        }

        Object result;

        final ReadableType readableType = readableMap.getType(key);
        switch (readableType) {
            case Null:
                result = key;
                break;
            case Boolean:
                result = readableMap.getBoolean(key);
                break;
            case Number:
                // Can be int or double.
                double tmp = readableMap.getDouble(key);
                if (tmp == (int) tmp) {
                    result = (int) tmp;
                } else {
                    result = tmp;
                }
                break;
            case String:
                result = readableMap.getString(key);
                break;
            case Map:
                result = readableMapToMap(readableMap.getMap(key));
                break;
            case Array:
                result = readableArrayToList(readableMap.getArray(key));
                break;
            default:
                throw new IllegalArgumentException("Could not convert object with key: " + key + ".");
        }

        return result;
    }

    public static WritableArray jsonToReact(final JSONArray jsonArray) throws JSONException {
        final WritableArray writableArray = Arguments.createArray();
        for (int i = 0; i < jsonArray.length(); i++) {
            final Object value = jsonArray.get(i);
            if (value instanceof Float || value instanceof Double) {
                writableArray.pushDouble(jsonArray.getDouble(i));
            } else if (value instanceof Number) {
                writableArray.pushInt(jsonArray.getInt(i));
            } else if (value instanceof String) {
                writableArray.pushString(jsonArray.getString(i));
            } else if (value instanceof Boolean) {
                writableArray.pushBoolean(jsonArray.getBoolean(i));
            } else if (value instanceof JSONObject) {
                writableArray.pushMap(jsonToReact(jsonArray.getJSONObject(i)));
            } else if (value instanceof JSONArray) {
                writableArray.pushArray(jsonToReact(jsonArray.getJSONArray(i)));
            } else if (value == JSONObject.NULL) {
                writableArray.pushNull();
            }
        }
        return writableArray;
    }

    public static WritableMap jsonToReact(final JSONObject jsonObject) throws JSONException {
        final WritableMap writableMap = Arguments.createMap();
        final Iterator iterator = jsonObject.keys();
        while (iterator.hasNext()) {
            final String key = (String) iterator.next();
            final Object value = jsonObject.get(key);
            if (value instanceof Float || value instanceof Double) {
                writableMap.putDouble(key, jsonObject.getDouble(key));
            } else if (value instanceof Number) {
                writableMap.putInt(key, jsonObject.getInt(key));
            } else if (value instanceof String) {
                writableMap.putString(key, jsonObject.getString(key));
            } else if (value instanceof JSONObject) {
                writableMap.putMap(key, jsonToReact(jsonObject.getJSONObject(key)));
            } else if (value instanceof JSONArray) {
                writableMap.putArray(key, jsonToReact(jsonObject.getJSONArray(key)));
            } else if (value instanceof Boolean) {
                writableMap.putBoolean(key, jsonObject.getBoolean(key));
            } else if (value == JSONObject.NULL) {
                writableMap.putNull(key);
            }
        }
        return writableMap;
    }

    private static final class Serializer implements JsonSerializer<ByteBuffer> {
        @Override
        public JsonElement serialize(final ByteBuffer src, final Type typeOfSrc, final JsonSerializationContext context) {
            final String payload = new String(src.array(), Charset.forName("UTF-8"));
            return new JsonPrimitive(payload);
        }
    }

    private static final class Deserializer implements JsonDeserializer<ByteBuffer> {
        @Override
        public ByteBuffer deserialize(final JsonElement json, final Type typeOfT, final JsonDeserializationContext context)
                throws JsonParseException {
            final String payload = json.getAsString();
            return ByteBuffer.wrap(payload.getBytes());
        }
    }

}
