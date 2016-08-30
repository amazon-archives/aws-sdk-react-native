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

#import <UIKit/UIKit.h>
#import <XCTest/XCTest.h>

#import <RCTTest/RCTTestRunner.h>
#import "RCTAssert.h"

#define RCT_TEST(name)                  \
- (void)test##name                      \
{                                       \
[_runner runTest:_cmd module:@#name]; \
}

@interface IntegrationTests : XCTestCase

@end

@implementation IntegrationTests
{
  RCTTestRunner *_runner;
}

- (void)setUp
{
  _runner = RCTInitRunnerForApp(@"IntegrationTests", nil);

}


- (void)testLambda_TestLambdaFunction
{
  [_runner runTest:_cmd
            module:@"Tests"
      initialProps:@{@"TestName": @"TestLambdaFunction"}
configurationBlock:nil];

}


#pragma mark - JS tests





@end
