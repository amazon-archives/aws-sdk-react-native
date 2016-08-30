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
#import "AWSRNCognitoCredentials.h"

@implementation AWSRNCognitoCredentials{
    NSMutableDictionary *options;
    AWSCognitoCredentialsProvider *credentialProvider;
    NSLock* lock;
    AWSRNHelper *helper;
}

@synthesize bridge = _bridge;

typedef void (^ Block)(id, int);

const NSString *IDENTITY_POOL_ID = @"identity_pool_id";
const NSString *REGION = @"region";
const NSString *ACCESS_KEY = @"access_key";
const NSString *SECRET_KEY = @"secret_key";
const NSString *SESSION_TOKEN = @"session_token";
const NSString *EXPIRATION = @"expiration";
const NSString *IDENTITY_ID = @"identity_id";

RCT_EXPORT_MODULE(AWSRNCognitoCredentials)

-(instancetype)init{
    self = [super init];
    if (self) {
        helper = [[AWSRNHelper alloc]init];
        [AWSServiceConfiguration addGlobalUserAgentProductToken:[NSString stringWithFormat:@"aws-sdk-react-native/%@",[helper getSDKVersion]]];
    }
    return self;
}

#pragma mark - Exposed Methods

RCT_EXPORT_METHOD(clearCredentials){
    [credentialProvider clearCredentials];
}

RCT_EXPORT_METHOD(clear){
    [credentialProvider clearKeychain];
}

RCT_EXPORT_METHOD(getCredentialsAsync:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    [[credentialProvider credentials] continueWithBlock:^id(AWSTask *task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw [NSException exceptionWithName:task.exception.name reason:task.exception.reason userInfo:task.exception.userInfo];
            });
        }
        if (task.error) {
            reject([NSString stringWithFormat:@"%ld",task.error.code],task.error.description,task.error);
        }
        else {
            AWSCredentials *cred = (AWSCredentials*) task.result;
            NSDictionary *dict = @{@"AccessKey":cred.accessKey,@"SecretKey":cred.secretKey,@"SessionKey":cred.sessionKey,@"Expiration":cred.expiration};
            resolve(dict);
        }
        return nil;
    }];
}

RCT_EXPORT_METHOD(getIdentityIDAsync:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    [[credentialProvider getIdentityId] continueWithBlock:^id(AWSTask *task) {
        if (task.exception){
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw [NSException exceptionWithName:task.exception.name reason:task.exception.reason userInfo:task.exception.userInfo];
            });
        }
        if (task.error) {
            reject([NSString stringWithFormat:@"%ld",task.error.code],task.error.description,task.error);
        }
        else {
            resolve(@{@"identityid":task.result});
        }
        return nil;
    }];
}

RCT_EXPORT_METHOD(isAuthenticated:(RCTResponseSenderBlock)callback){
    BOOL isAuth = [credentialProvider.identityProvider isAuthenticated];
    NSNumber* value = [NSNumber numberWithBool:isAuth];
    callback(@[[NSNull null],value]);
}


RCT_EXPORT_METHOD(initWithOptions:(NSDictionary *)inputOptions)
{

    [[NSNotificationCenter defaultCenter]
     addObserver:self
     selector:@selector(identityDidChange:)
     name:AWSCognitoIdentityIdChangedNotification object:nil];
    NSString *identityPoolId = [inputOptions objectForKey:IDENTITY_POOL_ID];
    NSString *region = [inputOptions objectForKey:REGION];
    credentialProvider = [[AWSCognitoCredentialsProvider alloc]initWithRegionType:[helper regionTypeFromString:region]  identityPoolId:identityPoolId identityProviderManager:self];
    AWSServiceConfiguration *configuration = [[AWSServiceConfiguration alloc] initWithRegion:[helper regionTypeFromString:region] credentialsProvider:credentialProvider];
    [configuration addUserAgentProductToken:@"AWSCognitoCredentials"];
    [AWSServiceManager defaultServiceManager].defaultServiceConfiguration = configuration;
}

#pragma mark - AWSIdentityProviderManager

- (AWSTask<NSDictionary<NSString *, NSString *> *> *)logins{
    if (!lock){
        lock = [[NSLock alloc]init];
    }
    return [[AWSTask taskWithResult:nil] continueWithSuccessBlock:^id _Nullable(AWSTask * _Nonnull task) {
        __block NSArray* arr;
        [self sendMessage:[[NSMutableDictionary alloc]init] toChannel:@"LoginsRequestedEvent" withCallback:^(NSArray* response){
            arr = response;
            [lock unlock];
        }];
        [lock lock];
        [lock unlock];
        if (![[arr objectAtIndex:0]isKindOfClass:[NSDictionary class]]){
            return [[NSDictionary alloc]init];
        }
        return [self setLogins:[arr objectAtIndex:0]];
    }];
}

#pragma mark - Helper Methods

-(AWSCognitoCredentialsProvider*)getCredentialsProvider{
    return credentialProvider;
}

-(void)identityDidChange:(NSNotification*)notification {
    NSMutableDictionary *dict = [[NSMutableDictionary alloc]init];
    [dict setValue:[notification.userInfo valueForKey:AWSCognitoNotificationPreviousId] forKey:@"Previous"];
    [dict setValue:[notification.userInfo valueForKey:AWSCognitoNotificationNewId] forKey:@"Current"];
    [self sendMessage:dict toChannel:@"IdentityChange" withCallback:nil];
}

-(void)sendMessage:(NSMutableDictionary*)info toChannel:(NSString*)channel withCallback:(RCTResponseSenderBlock)callback{
    if ([channel isEqualToString:@"LoginsRequestedEvent"]){
        [lock lock];
        [info setValue:callback forKey:@"ReturnInfo"];
    }
    [self.bridge.eventDispatcher
     sendAppEventWithName:channel
     body:[info copy]
     ];
}

-(NSMutableDictionary*)setLogins:(NSMutableDictionary*)reactLogins{
    NSMutableDictionary *logins = [[NSMutableDictionary alloc]init];
    for (NSString* key in reactLogins){
        if ([key isEqualToString:@"FacebookProvider"]){
            [logins setValue:[reactLogins objectForKey:key] forKey:AWSIdentityProviderFacebook];
            continue;
        }else if ([key isEqualToString:@"DigitsProvider"]){
            [logins setValue:[reactLogins objectForKey:key] forKey:AWSIdentityProviderDigits];
            continue;
        }else if ([key isEqualToString:@"GoogleProvider"]){
            [logins setValue:[reactLogins objectForKey:key] forKey:AWSIdentityProviderGoogle];
            continue;
        }else if ([key isEqualToString:@"AmazonProvider"]){
            [logins setValue:[reactLogins objectForKey:key] forKey:AWSIdentityProviderLoginWithAmazon];
            continue;
        }else if ([key isEqualToString:@"TwitterProvider"]){
            [logins setValue:[reactLogins objectForKey:key] forKey:AWSIdentityProviderTwitter];
            continue;
        }else if ([key isEqualToString:@"CognitoProvider"]){
            [logins setValue:[reactLogins objectForKey:key] forKey:AWSIdentityProviderAmazonCognitoIdentity];
            continue;
        }else{
            [logins setValue:[reactLogins objectForKey:key] forKey:key];
            continue;
        }
    }
    return logins;
}




@end
