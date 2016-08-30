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
2. Check out the [SDK source code](https://github.com/aws/aws-sdk-react-native).

### License

The source code is available under the Apache 2.0 license.
