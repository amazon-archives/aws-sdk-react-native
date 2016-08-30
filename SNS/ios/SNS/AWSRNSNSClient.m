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
#import "AWSRNSNSClient.h"
#import "AWSRNHelper.h"
#import "AWSRNCognitoCredentials.h"


@implementation AWSRNSNSClient{
    AWSSNS* SNS;
}
@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(AWSRNSNSClient);

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
    [AWSSNS registerSNSWithConfiguration:configuration forKey:@"react-native-SNS"];
    [configuration addUserAgentProductToken:@"AWSSNS"];
    self.SNS = [AWSSNS SNSForKey:@"react-native-SNS"];
}


RCT_EXPORT_METHOD(ListSubscriptionsByTopic:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSListSubscriptionsByTopicInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSListSubscriptionsByTopicInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS listSubscriptionsByTopic:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(Subscribe:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSSubscribeInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSSubscribeInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS subscribe:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(GetTopicAttributes:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSGetTopicAttributesInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSGetTopicAttributesInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS getTopicAttributes:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(AddPermission:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSAddPermissionInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSAddPermissionInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS addPermission:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(GetPlatformApplicationAttributes:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSGetPlatformApplicationAttributesInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSGetPlatformApplicationAttributesInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS getPlatformApplicationAttributes:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(CreatePlatformEndpoint:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSCreatePlatformEndpointInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSCreatePlatformEndpointInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS createPlatformEndpoint:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(DeletePlatformApplication:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSDeletePlatformApplicationInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSDeletePlatformApplicationInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS deletePlatformApplication:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(Unsubscribe:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSUnsubscribeInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSUnsubscribeInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS unsubscribe:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(SetSubscriptionAttributes:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSSetSubscriptionAttributesInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSSetSubscriptionAttributesInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS setSubscriptionAttributes:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(ListEndpointsByPlatformApplication:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSListEndpointsByPlatformApplicationInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSListEndpointsByPlatformApplicationInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS listEndpointsByPlatformApplication:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(ListSubscriptions:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSListSubscriptionsInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSListSubscriptionsInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS listSubscriptions:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(SetTopicAttributes:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSSetTopicAttributesInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSSetTopicAttributesInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS setTopicAttributes:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(GetEndpointAttributes:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSGetEndpointAttributesInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSGetEndpointAttributesInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS getEndpointAttributes:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(DeleteTopic:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSDeleteTopicInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSDeleteTopicInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS deleteTopic:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(SetEndpointAttributes:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSSetEndpointAttributesInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSSetEndpointAttributesInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS setEndpointAttributes:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(CreatePlatformApplication:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSCreatePlatformApplicationInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSCreatePlatformApplicationInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS createPlatformApplication:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(CreateTopic:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSCreateTopicInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSCreateTopicInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS createTopic:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(DeleteEndpoint:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSDeleteEndpointInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSDeleteEndpointInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS deleteEndpoint:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(GetSubscriptionAttributes:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSGetSubscriptionAttributesInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSGetSubscriptionAttributesInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS getSubscriptionAttributes:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(Publish:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSPublishInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSPublishInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS publish:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(ListTopics:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSListTopicsInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSListTopicsInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS listTopics:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(ConfirmSubscription:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSConfirmSubscriptionInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSConfirmSubscriptionInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS confirmSubscription:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(RemovePermission:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSRemovePermissionInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSRemovePermissionInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS removePermission:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(SetPlatformApplicationAttributes:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSSetPlatformApplicationAttributesInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSSetPlatformApplicationAttributesInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS setPlatformApplicationAttributes:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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


RCT_EXPORT_METHOD(ListPlatformApplications:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSSNSListPlatformApplicationsInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSSNSListPlatformApplicationsInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.SNS listPlatformApplications:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw task.exception;
            });
        }
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
