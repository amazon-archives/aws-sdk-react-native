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

import com.amazonaws.ClientConfiguration;

public class AWSRNClientConfiguration extends ClientConfiguration {

    private static final String USER_AGENT_STRING = "aws-sdk-react-native";
    private static final String SDK_VERSION = "0.0.1";

    public ClientConfiguration withUserAgent(final String userAgent) {
        setUserAgent(USER_AGENT_STRING + "/" + SDK_VERSION + "/" + userAgent);
        return this;
    }

}
