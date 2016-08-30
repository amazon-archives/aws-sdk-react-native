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

import android.support.test.rule.ActivityTestRule;
import android.support.test.runner.AndroidJUnit4;
import android.util.Log;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.WritableMap;

import junit.framework.TestCase;

import org.junit.Before;
import org.junit.Rule;
import org.junit.Test;
import org.junit.runner.RunWith;


@RunWith(AndroidJUnit4.class)
public class Tests extends TestCase {

    @Rule public final ActivityTestRule<MainActivity> main = new ActivityTestRule<>(MainActivity.class);

    @Before
    public void setUp() throws Exception {
        super.setUp();
        Thread.sleep(5000);
    }

    @Test
    public void TestLambdaFunction() throws Exception {
        final WritableMap map = Arguments.createMap();
        map.putString("testname","TestLambdaFunction");
        getExecutor().sendEvent("TestChannel",map);
        this.waitForTest("TestLambdaFunction");
    }

    public void waitForTest(final String test) throws Exception {
        int count = 0;
        while (count < 8) {
            Thread.sleep(5000);
            count++;
            if (getExecutor().testCompleted) {
                assertEquals(false, getExecutor().testFailed);
                break;
            }
        }
        if (!getExecutor().testCompleted) {
            fail(test + " did not finish in 40 seconds");
        } else {
            Log.d(this.getClass().toString(), test + " Passed!");
            getExecutor().resetTest();
        }
    }


    public AWSRNTestExecutor getExecutor(){
        return AWSRNTestExecutor.getInstance();
    }

}