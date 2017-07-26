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

@interface AWSRNCognitoCredentials()
    @property (nonatomic, readonly) NSDateFormatter *dateFormatterISO8601;
@end

@implementation AWSRNCognitoCredentials{
    NSMutableDictionary *options;
    AWSCognitoCredentialsProvider *credentialProvider;
    AWSRNHelper *helper;
    NSDateFormatter *_dateFormatterISO8601;
}

@synthesize bridge = _bridge;
@synthesize methodQueue = _methodQueue;
//@synthesize methodQueue = _methodQueue;

typedef void (^ Block)(id, int);

const NSString *IDENTITY_POOL_ID = @"identity_pool_id";
const NSString *REGION = @"region";
const NSString *ACCESS_KEY = @"access_key";
const NSString *SECRET_KEY = @"secret_key";
const NSString *SESSION_TOKEN = @"session_token";
const NSString *EXPIRATION = @"expiration";
const NSString *IDENTITY_ID = @"identity_id";

static NSMutableDictionary* callbacks;

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

-(NSDateFormatter*) dateFormatterISO8601 {
    if(! _dateFormatterISO8601){
        _dateFormatterISO8601 = [[NSDateFormatter alloc] init];
        [_dateFormatterISO8601 setLocale:[NSLocale localeWithLocaleIdentifier:@"en_US_POSIX"]];
        [_dateFormatterISO8601 setDateFormat:@"yyyy-MM-dd'T'HH:mm:ssZZZZZ"];
    }
    return _dateFormatterISO8601;
}


RCT_EXPORT_METHOD(getCredentialsAsync:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){

    //start a separate thread for this to avoid blocking the component queue, since
    //it will have to comunicate with the javascript in the mean time while trying to get the list of logins

    NSString* queueName = [NSString stringWithFormat:@"%@.getCredentialsAsyncQueue",
                           [NSString stringWithUTF8String:dispatch_queue_get_label(self.methodQueue)]
                           ];
    dispatch_queue_t concurrentQueue = dispatch_queue_create([queueName UTF8String], DISPATCH_QUEUE_CONCURRENT);

    dispatch_async(concurrentQueue, ^{

        [[credentialProvider credentials] continueWithBlock:^id(AWSTask *task) {
            if (task.error) {
                reject([NSString stringWithFormat:@"%ld",task.error.code],task.error.description,task.error);
            }
            else {
                AWSCredentials *cred = (AWSCredentials*) task.result;

                //using ISO 8601 to transport the dates over the wire.
                //easier to debug then passing the data as a number
                //javascript new Date(dateAsString) function takes an ISO 8601 string :)
                NSString* dateAsISO8601String = [self.dateFormatterISO8601 stringFromDate:cred.expiration];

                NSDictionary *dict = @{
                                       @"AccessKey":cred.accessKey,
                                       @"SecretKey":cred.secretKey,
                                       @"SessionKey":cred.sessionKey,
                                       @"Expiration":dateAsISO8601String};
                resolve(dict);
            }
            return nil;
        }];

    });
}

RCT_EXPORT_METHOD(getIdentityIDAsync:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    [[credentialProvider getIdentityId] continueWithBlock:^id(AWSTask *task) {
        if (task.error) {
            reject([NSString stringWithFormat:@"%ld",task.error.code],task.error.description,task.error);
        }
        else {
            resolve(@{@"identityId":task.result});
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
    return [[AWSTask taskWithResult:nil] continueWithSuccessBlock:^id _Nullable(AWSTask * _Nonnull task) {
        __block NSArray* arr;

        dispatch_semaphore_t sendMessageSemaphore = dispatch_semaphore_create(0);

        [self sendMessage:[[NSMutableDictionary alloc]init] toChannel:@"LoginsRequestedEvent" semaphore:sendMessageSemaphore withCallback:^(NSArray* response) {
            arr = response;
        }];

        dispatch_semaphore_wait(sendMessageSemaphore, DISPATCH_TIME_FOREVER);

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
    [self sendMessage:dict toChannel:@"IdentityChange"];
}


RCT_EXPORT_METHOD(sendCallbackResponse:(NSString *)callbackId response:(NSArray *)response){
    NSDictionary* callbackInfo = [callbacks objectForKey:callbackId];
    if(callbackInfo) {
        RCTResponseSenderBlock callback = callbackInfo[@"callback"];
        dispatch_semaphore_t semaphore = callbackInfo[@"semaphore"];
        [callbacks removeObjectForKey:callbackId];

        callback(response);
        dispatch_semaphore_signal(semaphore);
    }
    else{
        NSLog(@"WARN callback id not found!");
    }
}

-(NSString*) registerCallBack:(RCTResponseSenderBlock)callback semaphore:(dispatch_semaphore_t)semaphore {
    if (!callbacks){
        callbacks = [@{} mutableCopy];
    }
    NSString* callbackId = [[NSUUID UUID] UUIDString];
    callbacks[callbackId] = @{
                              @"callback": callback ? callback : (^(NSArray *response) { }),
                              @"semaphore":semaphore
                              };
    return callbackId;
}

-(void)sendMessage:(NSMutableDictionary*)info toChannel:(NSString*)channel{
    [self.bridge.eventDispatcher
     sendAppEventWithName:channel
     body:[info copy]
     ];
}

-(void)sendMessage:(NSMutableDictionary*)info toChannel:(NSString*)channel semaphore:(dispatch_semaphore_t)semaphore withCallback:(RCTResponseSenderBlock)callback  {
    NSString * callbackId = [self registerCallBack:callback semaphore:semaphore];
    [info setValue:callbackId forKey:@"callbackId"];
    [self sendMessage:info toChannel:channel];
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
