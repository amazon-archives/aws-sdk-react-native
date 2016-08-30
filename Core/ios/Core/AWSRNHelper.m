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
#import "AWSRNHelper.h"

@implementation AWSRNHelper

- (AWSRegionType)regionTypeFromString: (NSString*)region {
    AWSRegionType regionType = AWSRegionUnknown;
    if ([region isEqualToString:@"us-east-1"]) {
        regionType = AWSRegionUSEast1;
    } else if ([region isEqualToString:@"us-west-1"]) {
        regionType = AWSRegionUSWest1;
    } else if ([region isEqualToString:@"us-west-2"]) {
        regionType = AWSRegionUSWest2;
    } else if ([region isEqualToString:@"eu-west-1"]) {
        regionType = AWSRegionEUWest1;
    } else if ([region isEqualToString:@"eu-central-1"]) {
        regionType = AWSRegionEUCentral1;
    } else if ([region isEqualToString:@"ap-southeast-1"]) {
        regionType = AWSRegionAPSoutheast1;
    } else if ([region isEqualToString:@"ap-southeast-2"]) {
        regionType = AWSRegionAPSoutheast2;
    } else if ([region isEqualToString:@"ap-northeast-1"]) {
        regionType = AWSRegionAPNortheast1;
    } else if ([region isEqualToString:@"sa-east-1"]) {
        regionType = AWSRegionSAEast1;
    } else if ([region isEqualToString:@"cn-north-1"]) {
        regionType = AWSRegionCNNorth1;
    }
    return regionType;
}

-(NSString*)getSDKVersion{
    return @"0.0.1";
}


@end
