//
// Copyright 2010-2016 Amazon.com, Inc. or its affiliates. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the &quot;License&quot;).
// You may not use this file except in compliance with the License.
// A copy of the License is located at
//
// http://aws.amazon.com/apache2.0
//
// or in the &quot;license&quot; file accompanying this file. This file is distributed
// on an &quot;AS IS&quot; BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
// express or implied. See the License for the specific language governing
// permissions and limitations under the License.
//
#import "AWSRNLambdaClient.h"
#import "AWSRNHelper.h"
#import "AWSRNCognitoCredentials.h"


@implementation AWSRNLambdaClient{
    AWSLambda* Lambda;
}
@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(AWSRNLambdaClient);

RCT_EXPORT_METHOD(initWithOptions:(NSDictionary *)options){
    AWSRNHelper *helper = [[AWSRNHelper alloc]init];
    AWSRNCognitoCredentials* CognitoCredentials = (AWSRNCognitoCredentials*)[_bridge moduleForName:@"AWSRNCognitoCredentials"];
    int count = 0;
    while(![CognitoCredentials getCredentialsProvider] && count != 5){
        [NSThread sleepForTimeInterval:0.25];
        count++;
    }
    if(![CognitoCredentials getCredentialsProvider]){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:@"AWSCognitoCredentials is not initialized" userInfo:options];
    }
    AWSServiceConfiguration *configuration = [[AWSServiceConfiguration alloc] initWithRegion:[helper regionTypeFromString:[options objectForKey:@"region"]] credentialsProvider:[CognitoCredentials getCredentialsProvider]];
    [AWSLambda registerLambdaWithConfiguration:configuration forKey:@"react-native-Lambda"];
    [configuration addUserAgentProductToken:@"AWSLambda"];
    self.Lambda = [AWSLambda LambdaForKey:@"react-native-Lambda"];
}


RCT_EXPORT_METHOD(Invoke:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSLambdaInvocationRequest *request = [AWSMTLJSONAdapter modelOfClass:[AWSLambdaInvocationRequest class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.Lambda invoke:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if(task.error){
            reject([NSString stringWithFormat:@"%ld",task.error.code], [NSString stringWithFormat:@"%@",task.error.userInfo], task.error);
        }else{
            if([task.result isKindOfClass:[AWSModel class]]){
                NSDictionary *dict = [AWSMTLJSONAdapter JSONDictionaryFromModel:task.result];
                resolve(dict);
            }else{
                resolve(@{}) ;
            }
        }
        return nil;
    }];
}


@end
