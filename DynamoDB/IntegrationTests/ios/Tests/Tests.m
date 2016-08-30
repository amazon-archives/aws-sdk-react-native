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

@interface Tests : XCTestCase

@end

@implementation Tests
{
  RCTTestRunner *_runner;
}

- (void)setUp
{
  _runner = RCTInitRunnerForApp(@"IntegrationTests", nil);

}

- (void)testDynamoDB_TestTableCallsAsync
{
  [_runner runTest:_cmd
            module:@"ServiceTests"
      initialProps:@{@"TestName": @"TestTableCallsAsync"}
configurationBlock:nil];

}

- (void)testDynamoDB_ItemTransactions
{
  [_runner runTest:_cmd
            module:@"ServiceTests"
      initialProps:@{@"TestName": @"TestHashTable"}
configurationBlock:nil];
  [_runner runTest:_cmd
            module:@"ServiceTests"
      initialProps:@{@"TestName": @"TestHashRangeTable"}
configurationBlock:nil];
  [_runner runTest:_cmd
            module:@"ServiceTests"
      initialProps:@{@"TestName": @"TestBatchWriteGet"}
configurationBlock:nil];
  [_runner runTest:_cmd
            module:@"ServiceTests"
      initialProps:@{@"TestName": @"TestLargeBatches"}
configurationBlock:nil];

}







#pragma mark - JS tests





@end
