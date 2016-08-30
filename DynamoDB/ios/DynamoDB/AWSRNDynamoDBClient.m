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
#import "AWSRNDynamoDBClient.h"
#import "AWSRNHelper.h"
#import "AWSRNCognitoCredentials.h"


@implementation AWSRNDynamoDBClient{
    AWSDynamoDB* DynamoDB;
}
@synthesize bridge = _bridge;

RCT_EXPORT_MODULE(AWSRNDynamoDBClient);

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
    [AWSDynamoDB registerDynamoDBWithConfiguration:configuration forKey:@"react-native-DynamoDB"];
    [configuration addUserAgentProductToken:@"AWSDynamoDB"];
    self.DynamoDB = [AWSDynamoDB DynamoDBForKey:@"react-native-DynamoDB"];
}


RCT_EXPORT_METHOD(DeleteTable:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSDynamoDBDeleteTableInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSDynamoDBDeleteTableInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.DynamoDB deleteTable:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
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


RCT_EXPORT_METHOD(BatchGetItem:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSDynamoDBBatchGetItemInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSDynamoDBBatchGetItemInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.DynamoDB batchGetItem:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
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


RCT_EXPORT_METHOD(DescribeTable:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSDynamoDBDescribeTableInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSDynamoDBDescribeTableInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.DynamoDB describeTable:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
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


RCT_EXPORT_METHOD(PutItem:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSDynamoDBPutItemInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSDynamoDBPutItemInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.DynamoDB putItem:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
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


RCT_EXPORT_METHOD(Query:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSDynamoDBQueryInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSDynamoDBQueryInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.DynamoDB query:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
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


RCT_EXPORT_METHOD(Scan:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSDynamoDBScanInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSDynamoDBScanInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.DynamoDB scan:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
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


RCT_EXPORT_METHOD(DeleteItem:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSDynamoDBDeleteItemInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSDynamoDBDeleteItemInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.DynamoDB deleteItem:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
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


RCT_EXPORT_METHOD(UpdateItem:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSDynamoDBUpdateItemInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSDynamoDBUpdateItemInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.DynamoDB updateItem:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
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


RCT_EXPORT_METHOD(CreateTable:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSDynamoDBCreateTableInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSDynamoDBCreateTableInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.DynamoDB createTable:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
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


RCT_EXPORT_METHOD(BatchWriteItem:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSDynamoDBBatchWriteItemInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSDynamoDBBatchWriteItemInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.DynamoDB batchWriteItem:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
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


RCT_EXPORT_METHOD(GetItem:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSDynamoDBGetItemInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSDynamoDBGetItemInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.DynamoDB getItem:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
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


RCT_EXPORT_METHOD(DescribeLimits:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSDynamoDBDescribeLimitsInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSDynamoDBDescribeLimitsInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.DynamoDB describeLimits:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
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


RCT_EXPORT_METHOD(ListTables:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSDynamoDBListTablesInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSDynamoDBListTablesInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.DynamoDB listTables:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
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


RCT_EXPORT_METHOD(UpdateTable:(NSDictionary*)options resolver:(RCTPromiseResolveBlock)resolve rejecter:(RCTPromiseRejectBlock)reject){
    NSError *error;
    AWSDynamoDBUpdateTableInput *request = [AWSMTLJSONAdapter modelOfClass:[AWSDynamoDBUpdateTableInput class] fromJSONDictionary:options error:&error];
    if(error){
        @throw [NSException exceptionWithName:@"InvalidArgument" reason:error.localizedDescription userInfo:error.userInfo];
    }
    [[self.DynamoDB updateTable:request] continueWithBlock:^id _Nullable(AWSTask * _Nonnull task) {
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
