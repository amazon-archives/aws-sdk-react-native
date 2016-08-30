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


#import "AWSRNS3TransferUtility.h"
#import "AWSRNCognitoCredentials.h"

@implementation AWSRNS3TransferUtility{
    AWSS3TransferUtility *transferUtility;
    NSMutableDictionary *requestMap;
    AWSRNHelper *helper;
}

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(AWSRNS3TransferUtility);

#pragma mark - Exposed Methods

RCT_EXPORT_METHOD(initWithOptions:(NSDictionary* )options){
    if([options objectForKey:@"region"]){
        helper = [[AWSRNHelper alloc]init];
        requestMap = [[NSMutableDictionary alloc]init];
        AWSRNCognitoCredentials* CognitoCredentials = (AWSRNCognitoCredentials*)[_bridge moduleForName:@"AWSRNCognitoCredentials"];
        if(![CognitoCredentials getCredentialsProvider]){
            @throw [NSException exceptionWithName:@"InvalidArgument" reason:@"AWSCognitoCredentials is not initialized" userInfo:options];
        }
        AWSServiceConfiguration *configuration = [[AWSServiceConfiguration alloc] initWithRegion:[helper regionTypeFromString:[options objectForKey:@"region"]] credentialsProvider:[CognitoCredentials getCredentialsProvider]];
        [AWSS3TransferUtility registerS3TransferUtilityWithConfiguration:configuration forKey:@"react-native-transfer-utility"];
        [configuration addUserAgentProductToken:@"AWSS3TransferUtility"];
        transferUtility = [AWSS3TransferUtility S3TransferUtilityForKey:@"react-native-transfer-utility"];
    }else{
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:@"region not supplied" userInfo:options];
    }
}

RCT_EXPORT_METHOD(createDownloadRequest:(NSDictionary*)options withCallback:(RCTResponseSenderBlock)callback){
    if(!requestMap){
        callback(@[@"Error: requestMap is not initialized",[NSNull null]]);
        return;
    }
    NSArray *params = @[@"bucket",@"key",@"path",@"subscribe",@"completionhandler"];
    for (NSString *arg in params){
        if(![options objectForKey:arg]){
            callback(@[[NSString stringWithFormat:@"%@ is not provided",arg],[NSNull null]]);
            return;
        }
    }
    NSMutableDictionary *dict = [[NSMutableDictionary alloc]init];
    [dict setObject:[options objectForKey:@"bucket"] forKey:@"bucket"];
    [dict setObject:[options objectForKey:@"key"] forKey:@"key"];
    NSString *downloadingFilePath = [NSTemporaryDirectory() stringByAppendingPathComponent:[options objectForKey:@"path"]];
    NSURL *downloadingFileURL = [NSURL fileURLWithPath:downloadingFilePath];
    [dict setObject:downloadingFileURL forKey:@"path"];
    NSString *uuid = [[NSUUID UUID] UUIDString];
    if([options objectForKey:@"subscribe"]){
        AWSS3TransferUtilityDownloadExpression *expression = [AWSS3TransferUtilityDownloadExpression new];
        expression.progressBlock = ^(AWSS3TransferUtilityTask *task, NSProgress *progress) {
            NSDictionary* response = @{@"requestid":uuid,
                                       @"completedunitcount":@(progress.completedUnitCount),
                                       @"totalunitcount":@(progress.totalUnitCount),
                                       @"fractioncompleted":@(progress.fractionCompleted),
                                       @"type":@"download"
                                       };
            dispatch_async(dispatch_get_main_queue(), ^{
                [self sendMessage:response toChannel:@"ProgressEventUtility"];
            });
        };
        [dict setObject:expression forKey:@"expression"];
    }
    if([options objectForKey:@"completionhandler"]){
        AWSS3TransferUtilityDownloadCompletionHandlerBlock completionHandler = ^(AWSS3TransferUtilityDownloadTask *task, NSURL *location, NSData *data, NSError *error) {
            if (error){
                NSDictionary* response = @{
                                           @"requestid":uuid,
                                           @"error":@{
                                                   @"error":error,
                                                   @"description":error.description,
                                                   @"code":@(error.code)
                                                   },
                                           @"request":[NSNull null]
                                           };
                [self sendMessage:response toChannel:@"CompletionHandlerEvent"];
            }else{
                NSDictionary* response = @{
                                           @"requestid":uuid,
                                           @"error":[NSNull null],
                                           @"request":@{
                                                   @"response":task.response,
                                                   @"bucket":task.bucket,
                                                   @"key":task.key,
                                                   @"location":location.absoluteString
                                                   }
                                           };
                dispatch_async(dispatch_get_main_queue(), ^{
                    [self sendMessage:response toChannel:@"CompletionHandlerEvent"];
                });
            }
            [self safeDeleteTaskFromRequestMap:uuid];
        };
        [dict setObject:completionHandler forKey:@"completionhandler"];
    }
    [self safePutTaskInRequestMap:dict withUUID:uuid];
    callback(@[[NSNull null],uuid]);
}

RCT_EXPORT_METHOD(download:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    if(![options objectForKey:@"requestid"]){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:@"requestid is not supplied" userInfo:options];
    }
    NSMutableDictionary *request = [self safeGetTaskFromRequestMap:[options objectForKey:@"requestid"]];
    if(!request){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:@"requestid is invalid" userInfo:options];
    }
    [[transferUtility downloadToURL:(NSURL*)[request objectForKey:@"path"]
                             bucket:[request objectForKey:@"bucket"]
                                key:[request objectForKey:@"key"]
                         expression:[request objectForKey:@"expression"]
                   completionHander:[request objectForKey:@"completionhandler"]] continueWithBlock:^id(AWSTask *task) {
        if (task.error) {
            reject([NSString stringWithFormat: @"%ld", (long)task.error.code],task.error.description,task.error);
        }
        if (task.exception) {
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw [NSException exceptionWithName:task.exception.name reason:task.exception.reason userInfo:task.exception.userInfo];
            });
        }
        if (task.result) {
            AWSS3TransferUtilityDownloadTask *downloadTask = (AWSS3TransferUtilityDownloadTask*)task.result;
            @synchronized (requestMap) {
                [request setObject:downloadTask forKey:@"task"];
            }
            resolve(@{});
        }
        return nil;
    }];
}

RCT_EXPORT_METHOD(createUploadRequest:(NSDictionary*)options withCallback:(RCTResponseSenderBlock)callback){
    if(!requestMap){
        callback(@[@"Error: requestMap is not initialized",[NSNull null]]);
        return;
    }
    NSArray *params = @[@"bucket",@"key",@"path",@"contenttype",@"subscribe",@"completionhandler"];
    for (NSString *arg in params){
        if(![options objectForKey:arg]){
            callback(@[[NSString stringWithFormat:@"%@ is not provided",arg],[NSNull null]]);
            return;
        }
    }
    NSMutableDictionary *dict = [[NSMutableDictionary alloc]init];
    [dict setObject:[options objectForKey:@"bucket"] forKey:@"bucket"];
    [dict setObject:[options objectForKey:@"key"] forKey:@"key"];
    [dict setObject:[options objectForKey:@"contenttype"] forKey:@"contenttype"];
    [dict setObject:[options objectForKey:@"path"] forKey:@"path"];
    NSString *uuid = [[NSUUID UUID] UUIDString];
    if([options objectForKey:@"subscribe"]){
        AWSS3TransferUtilityUploadExpression *expression = [AWSS3TransferUtilityUploadExpression new];
        expression.progressBlock = ^(AWSS3TransferUtilityTask *task, NSProgress *progress) {
            NSDictionary* response = @{@"requestid":uuid,
                                       @"completedunitcount":@(progress.completedUnitCount),
                                       @"totalunitcount":@(progress.totalUnitCount),
                                       @"fractioncompleted":@(progress.fractionCompleted),
                                       @"type":@"upload"
                                       };
            [self sendMessage:response toChannel:@"ProgressEventUtility"];
        };
        [dict setObject:expression forKey:@"expression"];
    }
    if([options objectForKey:@"completionhandler"]){
        AWSS3TransferUtilityUploadCompletionHandlerBlock completionHandler = ^(AWSS3TransferUtilityUploadTask *task, NSError *error) {
            if (error){
                NSDictionary* response = @{
                                           @"requestid":uuid,
                                           @"error":@{
                                                   @"error":error,
                                                   @"description":error.description,
                                                   @"code":@(error.code)
                                                   },
                                           @"request":[NSNull null]
                                           };
                [self sendMessage:response toChannel:@"CompletionHandlerEvent"];
            }else{
                NSDictionary* response = @{
                                           @"requestid":uuid,
                                           @"error":[NSNull null],
                                           @"request":@{
                                                   @"response":task.response,
                                                   @"bucket":task.bucket,
                                                   @"key":task.key
                                                   }
                                           };
                [self sendMessage:response toChannel:@"CompletionHandlerEvent"];
            }
            [self safeDeleteTaskFromRequestMap:uuid];
        };
        [dict setObject:completionHandler forKey:@"completionhandler"];
    }
    [self safePutTaskInRequestMap:dict withUUID:uuid];
    callback(@[[NSNull null],uuid]);
}

RCT_EXPORT_METHOD(upload:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    if(![options objectForKey:@"requestid"]){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:@"requestid is not supplied" userInfo:options];
    }
    NSMutableDictionary *request = [self safeGetTaskFromRequestMap:[options objectForKey:@"requestid"]];
    if(!request){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:@"requestid is invalid" userInfo:options];
    }
    [[transferUtility uploadFile:[NSURL URLWithString:[request objectForKey:@"path"]]
                          bucket:[request objectForKey:@"bucket"]
                             key:[request objectForKey:@"key"]
                     contentType:[request objectForKey:@"contenttype"]
                      expression:[request objectForKey:@"expression"]
                completionHander:[request objectForKey:@"completionhandler"]] continueWithBlock:^id(AWSTask *task) {
        if (task.error) {
            reject([NSString stringWithFormat: @"%ld", (long)task.error.code],task.error.description,task.error);
        }
        if (task.exception) {
            dispatch_async(dispatch_get_main_queue(), ^{
                @throw [NSException exceptionWithName:task.exception.name reason:task.exception.reason userInfo:task.exception.userInfo];
            });
        }
        if (task.result) {
            AWSS3TransferUtilityUploadTask *uploadTask = (AWSS3TransferUtilityUploadTask*)task.result;
            @synchronized (requestMap) {
                [request setObject:uploadTask forKey:@"task"];
            }
            resolve(@{});
        }
        return nil;
    }];
}

RCT_EXPORT_METHOD(editRequest:(NSDictionary *)options){
    if(![options objectForKey:@"config"]){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:@"config is not supplied" userInfo:options];
    }
    if(!([options objectForKey:@"request"]||[options objectForKey:@"option"])){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:@"request and option are not supplied. Please supply one" userInfo:options];
    }
    if([options objectForKey:@"request"]&&[options objectForKey:@"option"]){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:@"request and option are both supplied. Please supply only one" userInfo:options];
    }
    if ([[options objectForKey:@"config"] isEqualToString:@"pause"]){
        [self pauseEvent:[options objectForKey:@"request"] withOption:[options objectForKey:@"option"]];
    }else if ([[options objectForKey:@"config"] isEqualToString:@"cancel"]){
        [self cancelEvent:[options objectForKey:@"request"] withOption:[options objectForKey:@"option"]];
    }else if ([[options objectForKey:@"config"] isEqualToString:@"resume"]){
        [self resumeEvent:[options objectForKey:@"request"] withOption:[options objectForKey:@"option"]];
    }

}

-(void)pauseEvent:(NSString*)requestID withOption:(NSString*)option{
    if([option isEqualToString:@"all"]){
        for(NSString *key in requestMap){
            AWSS3TransferUtilityTask *task = [[self safeGetTaskFromRequestMap:key]objectForKey:@"task"];
            [task suspend];
        }
    }
    else if([option isEqualToString:@"upload"]){
        for(NSString *key in requestMap){
            AWSS3TransferUtilityTask *task = [[self safeGetTaskFromRequestMap:key]objectForKey:@"task"];
            if([task isKindOfClass:[AWSS3TransferUtilityUploadTask class]]){
                [task suspend];
            }else{
                continue;
            }
        }
    }else if([option isEqualToString:@"download"]){
        for(NSString *key in requestMap){
            AWSS3TransferUtilityTask *task = [[self safeGetTaskFromRequestMap:key]objectForKey:@"task"];
            if([task isKindOfClass:[AWSS3TransferUtilityDownloadTask class]]){
                [task suspend];
            }else{
                continue;
            }
        }
    }else{
        if([self safeGetTaskFromRequestMap:requestID]){
            AWSS3TransferUtilityTask *task = [[self safeGetTaskFromRequestMap:requestID]objectForKey:@"task"];
            [task suspend];
        }else{
            NSLog(@"request or option is not valid");
        }
    }
}

-(void)cancelEvent:(NSString*)requestID withOption:(NSString*)option{
    if([option isEqualToString:@"all"]){
        for(NSString *key in requestMap){
            AWSS3TransferUtilityTask *task = [[self safeGetTaskFromRequestMap:key]objectForKey:@"task"];
            [task cancel];
            [self safeDeleteTaskFromRequestMap:key];
        }
    }
    else if([option isEqualToString:@"upload"]){
        for(NSString *key in requestMap){
            AWSS3TransferUtilityTask *task = [[self safeGetTaskFromRequestMap:key]objectForKey:@"task"];
            if([task isKindOfClass:[AWSS3TransferUtilityUploadTask class]]){
                [task cancel];
                [self safeDeleteTaskFromRequestMap:key];
            }else{
                continue;
            }
        }
    }else if([option isEqualToString:@"download"]){
        for(NSString *key in requestMap){
            AWSS3TransferUtilityTask *task = [[self safeGetTaskFromRequestMap:key]objectForKey:@"task"];
            if([task isKindOfClass:[AWSS3TransferUtilityDownloadTask class]]){
                [task cancel];
                [self safeDeleteTaskFromRequestMap:key];
            }else{
                continue;
            }
        }
    }else{
        if([self safeGetTaskFromRequestMap:requestID]){
            AWSS3TransferUtilityTask *task = [[self safeGetTaskFromRequestMap:requestID]objectForKey:@"task"];
            [task cancel];
            [self safeDeleteTaskFromRequestMap:requestID];
        }else{
            NSLog(@"request or option is not valid");
        }
    }
}

-(void)resumeEvent:(NSString*)requestID withOption:(NSString*)option{
    if([option isEqualToString:@"all"]){
        for(NSString *key in requestMap){
            AWSS3TransferUtilityTask *task = [[self safeGetTaskFromRequestMap:key]objectForKey:@"task"];
            [task resume];
        }
    }
    else if([option isEqualToString:@"upload"]){
        for(NSString *key in requestMap){
            AWSS3TransferUtilityTask *task = [[self safeGetTaskFromRequestMap:key]objectForKey:@"task"];
            if([task isKindOfClass:[AWSS3TransferUtilityUploadTask class]]){
                [task resume];
            }else{
                continue;
            }
        }
    }else if([option isEqualToString:@"download"]){
        for(NSString *key in requestMap){
            AWSS3TransferUtilityTask *task = [[self safeGetTaskFromRequestMap:key]objectForKey:@"task"];
            if([task isKindOfClass:[AWSS3TransferUtilityDownloadTask class]]){
                [task resume];
            }else{
                continue;
            }
        }
    }else{
        if([self safeGetTaskFromRequestMap:requestID]){
            AWSS3TransferUtilityTask *task = [[self safeGetTaskFromRequestMap:requestID]objectForKey:@"task"];
            [task resume];
        }else{
            NSLog(@"request or option is not valid");
        }
    }
}

-(NSMutableDictionary*)safeGetTaskFromRequestMap:(NSString*)uuid{
    @synchronized (requestMap) {
        if([requestMap objectForKey:uuid]){
            return [requestMap objectForKey:uuid];
        }else{
            return nil;
        }
    }
}

-(void)safePutTaskInRequestMap:(NSMutableDictionary*)task withUUID:(NSString*)uuid{
    @synchronized (requestMap) {
        [requestMap setObject:task forKey:uuid];
    }
}

-(void)safeDeleteTaskFromRequestMap:(NSString*)key{
    @synchronized (requestMap) {
        if([requestMap objectForKey:key]){
            [requestMap removeObjectForKey:key];
        }
    }
}

-(void)sendMessage:(NSDictionary*)info toChannel:(NSString*)channel {
    [self.bridge.eventDispatcher
     sendAppEventWithName:channel
     body:[info copy]
     ];
}

@end
