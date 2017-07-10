//
// Copyright 2010-2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
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

#import "Login.h"
#import "AppDelegate.h"

@interface AWSCognitoIdentityUserPool()

@property (nonatomic, strong) AWSCognitoIdentityProvider *client;
- (NSString *) calculateSecretHash: (NSString*) userName;

@end


@interface Login()
@property (nonatomic,strong) AWSTaskCompletionSource<AWSCognitoIdentityPasswordAuthenticationDetails *>* passwordAuthenticationCompletion;
@property (nonatomic,strong) AWSCognitoIdentityUserGetDetailsResponse * response;
@property (nonatomic, strong) AWSCognitoIdentityUser * user;
@property (nonatomic, strong) AWSCognitoIdentityUserPool * pool;
@end

@implementation Login

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(initWithOptions:(NSDictionary* )options){
    NSString* region = [options objectForKey:@"region"];
		NSString* appId = [options objectForKey:@"appId"];
		NSString* appSecret = [options objectForKey:@"appSecret"];
		NSString* userPoolId = [options objectForKey:@"userPoolId"];
		
		AWSServiceConfiguration *serviceConfig = [[AWSServiceConfiguration alloc] initWithRegion:[region aws_regionTypeValue] credentialsProvider:nil];
		
		AWSCognitoIdentityUserPoolConfiguration *config = [[AWSCognitoIdentityUserPoolConfiguration alloc] initWithClientId:appId clientSecret:appSecret poolId:userPoolId];
		
		[AWSCognitoIdentityUserPool registerCognitoIdentityUserPoolWithConfiguration:serviceConfig userPoolConfiguration:config forKey:@"UserPool"];
		
		AWSCognitoIdentityUserPool *pool = [AWSCognitoIdentityUserPool CognitoIdentityUserPoolForKey:@"UserPool"];
    pool.delegate =self;
    self.pool  = pool;
    self.user = [pool getUser];
}

RCT_EXPORT_METHOD(signin: (NSDictionary*)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  NSString *userName = [options objectForKey:@"username"];
  NSString *password = [options objectForKey:@"password"];
  
  [[self.user getSession:userName password:password validationData:nil] continueWithBlock:^id _Nullable(AWSTask<AWSCognitoIdentityUserSession *> * _Nonnull t) {
    if(t.error){
      reject(@"Login",@"error getting session",t.error);
    }else{
      NSMutableDictionary *dictionary = [[NSMutableDictionary alloc]init];
      [dictionary setObject:[[t.result idToken] tokenString] forKey:@"idToken"];
      [dictionary setObject:[[t.result accessToken] tokenString] forKey:@"accessToken"];
      [dictionary setObject:[[t.result refreshToken] tokenString] forKey:@"refreshToken"];
      resolve(dictionary);
    }
    return nil;
  }];
}

RCT_EXPORT_METHOD(registerUser:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  NSString *userName = [options objectForKey:@"username"];
  NSString *password = [options objectForKey:@"password"];
  NSArray *userAttributes = [options objectForKey:@"userAttributes"];
  NSArray *validationData = [options objectForKey:@"validationData"];
  //TODO: transform userAttributes from name, value to userattribute type.
  
  NSMutableArray<AWSCognitoIdentityUserAttributeType *> *attributes = [NSMutableArray new];
  for(NSDictionary *obj in userAttributes){
    AWSCognitoIdentityUserAttributeType *att = [[AWSCognitoIdentityUserAttributeType alloc]initWithName:[obj objectForKey:@"name"] value:[obj objectForKey:@"value"]];
    [attributes addObject:att];
  }
  
  AWSCognitoIdentityUserPool *pool = [AWSCognitoIdentityUserPool CognitoIdentityUserPoolForKey:@"UserPool"];
  [[pool signUp:userName password:password userAttributes:[attributes copy] validationData:nil] continueWithBlock:^id _Nullable(AWSTask<AWSCognitoIdentityUserPoolSignUpResponse *> * _Nonnull t) {
    if(t.error){
      reject(@"Signup",@"error registering user",t.error);
    }else{
      self.user = [t.result user];
      NSMutableDictionary *dictionary = [[NSMutableDictionary alloc]init];
      [dictionary setObject:[[t.result user] username] forKey:@"username"];
      [dictionary setObject:[t.result userConfirmed] forKey:@"confirmationStatus"];
      resolve(dictionary);
    }
    return nil;
  }];
}

RCT_EXPORT_METHOD(confirmUser:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  NSString *confirmationCode = [options objectForKey:@"confirmationCode"];
  NSString *userName = [options objectForKey:@"username"];
	
	NSLog(@"Username is %@ confirmationCode is %@", userName, confirmationCode);
	
  AWSCognitoIdentityProviderConfirmSignUpRequest *request = [AWSCognitoIdentityProviderConfirmSignUpRequest new];
  request.clientId = self.pool.userPoolConfiguration.clientId;
  request.username = userName;
  request.secretHash = [self.pool calculateSecretHash:userName];
  request.confirmationCode = confirmationCode;
	request.forceAliasCreation = @YES;
	
	[[self.pool.client confirmSignUp:request] continueWithBlock:^id _Nullable(AWSTask<AWSCognitoIdentityProviderConfirmSignUpResponse *> * _Nonnull t) {
      if(t.error){
        reject(@"ConfirmUser",@"error confirming user",t.error);
      }else{
        resolve(@"");
      }
      return nil;
  }];
}


RCT_EXPORT_METHOD(refreshSession:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  [[self.user getSession] continueWithBlock:^id _Nullable(AWSTask<AWSCognitoIdentityUserSession *> * _Nonnull t) {
    if(t.error){
      reject(@"RefreshSession",@"error getting session",t.error);
    }else{
      NSMutableDictionary *dictionary = [[NSMutableDictionary alloc]init];
      [dictionary setObject:[[t.result idToken] tokenString] forKey:@"idToken"];
      [dictionary setObject:[[t.result accessToken] tokenString] forKey:@"accessToken"];
      [dictionary setObject:[[t.result refreshToken] tokenString] forKey:@"refreshToken"];
      resolve(dictionary);
    }
    return nil;
  }];
}

RCT_EXPORT_METHOD(forgotPassword:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  [[self.user forgotPassword] continueWithBlock:^id _Nullable(AWSTask<AWSCognitoIdentityUserSession *> * _Nonnull t) {
    if(t.error){
      reject(@"ForgotPassword",@"error in forgot password",t.error);
    }else{
      resolve(@"");
    }
    return nil;
  }];
}

RCT_EXPORT_METHOD(confirmForgotPassword:(NSDictionary *)options
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject){
  NSString *code = [options objectForKey:@"code"];
  NSString *newPassword = [options objectForKey:@"newPassword"];
  
  [[self.user confirmForgotPassword:code password:newPassword] continueWithBlock:^id _Nullable(AWSTask<AWSCognitoIdentityUserSession *> * _Nonnull t) {
    if(t.error){
      reject(@"Confirm ForgotPassword",@"error in confirm forgot password",t.error);
    }else{
      resolve(@"");
    }
    return nil;
  }];
}

@end
