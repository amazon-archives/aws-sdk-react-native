### Introduction
This sample demonstrates the use of the TransferUtility to upload and download files from Amazon S3. 

### Configuration
1. Create a [federated Cognito Identity pool](https://console.aws.amazon.com/cognito/federated/?region=us-east-1) that permits Unauthenticated access. 
2. Update the IAM Role associated with the identity pool to permit Get and Put access to S3.
3. Create an S3 bucket if one doesn't exist.
4. Upload a large object into the bucket. 20 MB should suffice.
5. Open [app/TransferUtility.js](https://github.com/awslabs/aws-sdk-react-native/blob/master/TransferUtility/example/app/TransferUtility.js) and fill in the blanks:
  1. `S3Region` (line #38) is the region where the bucket was created e.g. us-west-2
  2. `CognitoRegion` (line #39) is the region where the identity pool was created e.g. us-east-1
  3. `identity_pool_id` is the unique ID for the identity pool. This value is available in the Cognito console.
  4. `BucketName` is the name of the S3 bucket.
  5. `DownloadKeyName` is the name of the large file stored in the bucket e.g. video.mp4
  6. `UploadKeyName` is the name of an image that will be uploaded to S3. Use "jpg" as the suffix e.g. picture.jpg.

### Run the Sample
First, ensure that Core has been built into an npm package using ```npm pack```.
```
npm install
npm link
react-native run-android
react-native run-ios
```
