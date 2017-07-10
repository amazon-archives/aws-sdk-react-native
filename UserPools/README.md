# Cognito User Pools with React Native sample

- First ensure that you have the React Native CLI installed and you can create/run a React Native project. For more information please see [the official Facebook documentation](https://facebook.github.io/react-native/docs/getting-started.html)

- Click the button below to import the project into Mobile Hub:

<p align="center"><a target="_blank" href="https://console.aws.amazon.com/mobilehub/home?#/?config=https://github.com/awslabs/aws-sdk-react-native/blob/master/UserPools/mobile-hub-project.yml"><span><img height="100%" src="https://s3.amazonaws.com/deploytomh/button-deploy-aws-mh.png"/></span></a></p>

- In the Mobile Hub console click the Hosting and Streaming tab and at the bottom of the page download the **aws-exports.js** file

- Select **Resources** on the left hand side of the Mobile Hub console and click the link for **Amazon Cognito User Pools**. This should open up the Amazon Cognito User Pool Console.

- Select **App clients** on the left hand side and locate the **App client id** that does _NOT_ have "web" at the end of the name. Click **Show Details**

- Note the **App client id** and **App client secret** as you will need them in the next step

- Edit the **aws-exports.js** file you downloaded and replace **APP\_CLIENT\_ID** and **APP\_CLIENT\_SECRET** like below (you will need to add in the `ios_appId` and `ios_appSecret` manually):

```
const awsmobile = {
ios_appId: 'APP_CLIENT_ID',     //Added manually
ios_appSecret: 'APP_CLIENT_SECRET', //Added manually
aws_cognito_identity_pool_id : 'aws-region:XXXX',
}
```

- Still in the file change `var AWS = require('aws-sdk');` to be `var AWS = require('aws-sdk/dist/aws-sdk-react-native');`

- Save the changes to your file.

- Clone this directory locally and place the **aws-exports.js** file that you modified in the root of the directory (in the same folder as `Auth.js`).

- Run the following commands:

```
npm install
react-native run-ios
```

When the app starts use the bottom input boxes to enter:
1. Unique username
2. Password
3. Email address
4. Phone number (formatted with country code: e.g. +12223334444)

Press **Register User** and after that you should recieve a text message. Click **Enter Confirmation code** and enter the code sent to you via SMS to complete the registration process.

Type the **username** and **password** that you registered into the top two boxes. Click **Sign-In** and if the process is successful it should navigate you to a page showing your AWS Credentials. These can now be used with the [AWS SDK for JavaScript](https://github.com/aws/aws-sdk-js) to sign requests to AWS resources from within your React Native application.
