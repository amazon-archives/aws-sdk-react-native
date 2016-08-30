### Introduction
This sample demonstrates the use of the Cognito Identity to authenticate using Facebook.

### Configuration
1. Create a [Facebook application](https://developers.facebook.com/).
2. Create a [federated Cognito Identity pool](https://console.aws.amazon.com/cognito/federated/?region=us-east-1) that permits both Authenticated and Unauthenticated access. 
3. Add Facebook as an option and fill in the required information.
4. Update [app/index.js](https://github.com/awslabs/aws-sdk-react-native/blob/master/Core/example/app/index.js) with the identity pool ID and the region.
  1. ```region``` (line #59) is the region where the identity pool was created e.g. us-east-1
  2. ```identity_pool_id``` (line #60) is the unique ID for the identity pool.
5. Add the Facebook application ID to the [Xcode project plist](https://github.com/awslabs/aws-sdk-react-native/blob/master/Core/example/ios/example/Info.plist#L26). There are two spots: line #26 and line #33.
6. Add the Facebook application ID to [the Android app](https://github.com/awslabs/aws-sdk-react-native/blob/master/Core/example/android/app/src/main/res/values/strings.xml#L3).

### Run the Sample
First, ensure that Core has been built into an npm package using ```npm pack```.
```
npm install
npm link
react-native run-android
react-native run-ios
```
