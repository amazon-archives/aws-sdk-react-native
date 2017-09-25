Hi everyone, thank you for your interest in this project. We've released a new React Native starter kit at https://github.com/awslabs/aws-mobile-react-native-starter. This kit demonstrates a working React Native app with the following services:

* Amazon Cognito User Pools
* Amazon Cognito Federated Identities
* Amazon API Gateway
* AWS Lambda
* Amazon DynamoDB
* Amazon S3
* AWS Mobile Hub

Try it out and give us feedback.

---

Hi! This developer preview is currently under review and we will be looking to merge the contents in the future under a single repository for all AWS React Native functionality. In the meantime, we recommend you leverage the official [AWS JavaScript SDK with React Native support](https://github.com/aws/aws-sdk-js).

-- AWS team (May 24, 2017)

---

# AWS SDK for React Native

We’re excited to offer a developer preview of the AWS SDK for React Native. The SDK includes support for the following services:

1. [Amazon S3](https://aws.amazon.com/s3/) to store user data, including photos and videos, in the cloud. It uses the TransferUtility, which simplifies file transfers between your app and the cloud.
2. [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) to store data into a NoSQL database.
3. [AWS Lambda](https://aws.amazon.com/lambda/) to run serverless code in the cloud without the need for backend infrastructure.
4. [Amazon SNS](https://aws.amazon.com/sns/) to send and receive push notifications.

The SDK core uses [Amazon Cognito Identity](https://aws.amazon.com/cognito/) as the authentication provider to comply with best practices for mobile app development.

### Contributions
Contributions are welcome! Please report issues using the [Github issue tracker](https://github.com/awslabs/aws-sdk-react-native/issues). To contribute, [submit a pull request](https://github.com/awslabs/aws-sdk-react-native/pulls) to the GitHub repository with a description of your issue or suggested change. If this is a bug fix, please reference the issue and include steps to reproduce it.

### Set Up your Environment

1. Install Xcode, Android Studio, and other dependencies based on the [React Native Getting Started](https://facebook.github.io/react-native/docs/getting-started.html#content) guide.
2. Check out the [SDK source code](https://github.com/awslabs/aws-sdk-react-native).

### Build the SDK
1. Run ```npm pack``` for Core.
2. Run ```npm install``` for each service.

#### iOS only

1. Download the [AWS Mobile SDK for iOS](https://aws.amazon.com/mobile/sdk/) and extract the frameworks.
2. For each service, copy the relevant .framework into the iOS/Frameworks folder.
3. Build each Xcode project. You may need to adjust the header search path.

### License

The source code is available under the Apache 2.0 license.
