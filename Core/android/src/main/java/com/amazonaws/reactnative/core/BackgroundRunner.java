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

import android.os.AsyncTask;

import com.facebook.react.bridge.Promise;

/**
 * Utility for executing tasks on a background thread and providing output/failure notifications via a Promise bridge.
 */
public class BackgroundRunner {

    // NOTE: wanted these to be lambdas but I couldn't get the jack toolchain enabled :[
    // https://developer.android.com/guide/platform/j8-jack.html

    public static interface Supplier<OUTPUT> {
        /**
         * Instructs the supplier to produce and return its output.
         */
        OUTPUT get() throws Exception;
    }

    public static interface Function<INPUT, OUTPUT> {
        /**
         * Instructs the function to produce and return its output.
         */
        OUTPUT apply(INPUT input) throws Exception;
    }

    public static interface PromiseRejector {
        /**
         * Rejects the given promise in the manner most appropriate for the encountered failure.
         */
        void reject(Exception e, Promise promise);
    }

    /**
     * Executes the given function in the background and resolves the promise with its output, or rejects the promise
     * with any error encountered.
     *
     * @param backgroundTask the function to execute in the background.
     * @param promise the bridge instance to update with the results of the function. If the function succeeds, its
     *        output is forwarded to the promise's {@link Promise#resolve resolve} method. Otherwise, the caught
     *        exception is passed to the promise's {@link Promise#reject reject} method.
     */
    public <OUTPUT> void runInBackground(Supplier<OUTPUT> backgroundTask, Promise promise) {
        runInBackground(backgroundTask, DEFAULT_REJECTOR, promise);
    }

    /**
     * Executes the given function in the background and resolves the promise with its output, or rejects the promise
     * with any error encountered.
     *
     * @param backgroundTask the function to execute in the background.
     * @param promiseRejector invokes the promise reject overload most appropriate for the given failure.
     * @param promise the bridge instance to update with the results of the function. If the function succeeds, its
     *        output is forwarded to the promise's {@link Promise#resolve resolve} method. Otherwise, the caught
     *        exception is passed to the promise's {@link Promise#reject reject} method.
     */
    public <OUTPUT> void runInBackground(
        Supplier<OUTPUT> backgroundTask,
        PromiseRejector promiseRejector,
        Promise promise
    ) {
        runInBackground(
            SUPPLIER_BRIDGE,
            promiseRejector,
            (Supplier<Object>)backgroundTask, // technically, this erases OUTPUT but that's OK
            promise
        );
    }

    /**
     * Variant of {@link #runInBackground(Supplier,Promise)} that allows you to re-use a generic task definition.
     * <p>
     * Executes the given function in the background and resolves the promise with its output, or rejects the promise
     * with any error encountered.
     *
     * @param backgroundTask the function to execute in the background.
     * @param input the input data to provide to the {@code backgroundTask} function. Can be {@code null}.
     * @param promise the bridge instance to update with the results of the function. If the function succeeds, its
     *        output is forwarded to the promise's {@link Promise#resolve resolve} method. Otherwise, the caught
     *        exception is passed to the promise's {@link Promise#reject reject} method.
     */
    public <INPUT, OUTPUT> void runInBackground(
        Function<INPUT, OUTPUT> backgroundTask,
        INPUT input,
        Promise promise
    ) {
        runInBackground(backgroundTask, DEFAULT_REJECTOR, input, promise);
    }

    /**
     * Variant of {@link #runInBackground(Supplier,Promise)} that allows you to re-use a generic task definition.
     * <p>
     * Executes the given function in the background and resolves the promise with its output, or rejects the promise
     * with any error encountered.
     *
     * @param backgroundTask the function to execute in the background.
     * @param promiseRejector invokes the promise reject overload most appropriate for the given failure.
     * @param input the input data to provide to the {@code backgroundTask} function. Can be {@code null}.
     * @param promise the bridge instance to update with the results of the function. If the function succeeds, its
     *        output is forwarded to the promise's {@link Promise#resolve resolve} method. Otherwise, the caught
     *        exception is passed to the promise's {@link Promise#reject reject} method.
     */
    public <INPUT, OUTPUT> void runInBackground(
        Function<INPUT, OUTPUT> backgroundTask,
        PromiseRejector promiseRejector,
        INPUT input,
        Promise promise
    ) {
        if(backgroundTask == null) throw new NullPointerException("backgroundTask is required.");
        if(promiseRejector == null) throw new NullPointerException("promiseRejector is required.");
        if(promise == null) throw new NullPointerException("promise is required.");

        (new TaskRunner(backgroundTask, promiseRejector, promise)).execute(input);
    }

    private static class BackgroundTaskResult<T> {
        public Exception failure;
        public T result;
    }

    private static class TaskRunner<INPUT, OUTPUT> extends AsyncTask<INPUT, Void, BackgroundTaskResult<OUTPUT>> {
        private final Function<INPUT, OUTPUT> backgroundTask;
        private final PromiseRejector promiseRejector;
        private final Promise promise;

        public TaskRunner(
            Function<INPUT, OUTPUT> backgroundTask,
            PromiseRejector promiseRejector,
            Promise promise
        ) {
            this.backgroundTask = backgroundTask;
            this.promiseRejector = promiseRejector;
            this.promise = promise;
        }

        @Override
        protected BackgroundTaskResult<OUTPUT> doInBackground(INPUT... input) {
            BackgroundTaskResult<OUTPUT> result = new BackgroundTaskResult<>();
            try {
                result.result = backgroundTask.apply(input[0]);
            }
            catch(Exception e) {
                result.failure = e;
                e.printStackTrace();
            }
            return result;
        }

        @Override
        protected void onPostExecute(BackgroundTaskResult<OUTPUT> result) {
            if(result.failure != null)
                promiseRejector.reject(result.failure, promise);
            else
                promise.resolve(result.result);
        }

    }

    private static final Function<Supplier<Object>, Object> SUPPLIER_BRIDGE = new Function<Supplier<Object>, Object>() {
        @Override
        public Object apply(Supplier<Object> input) throws Exception { return input.get(); }
    };

    private static final PromiseRejector DEFAULT_REJECTOR = new PromiseRejector() {
        @Override
        public void reject(Exception e, Promise promise) { promise.reject(e); }
    };

}
