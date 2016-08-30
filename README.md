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


##Include the SDK in an Existing Application

###Samples
Please refer to either 
* "Running the high level client example applications"
* "Testing the low level clients"
to view an already set up React Native application with a certain SDK demonstrated.

###Install the SDK

        $ cd MyApplicationRoot/
        $ npm install aws-sdk-react-native-<InsertServiceName> 

<InsertServiceName> can be either:
* dynamodb
* sns
* s3
* lambda

Note: The name may differ in terms of capitalization as it is refered to later in this README. 

###link to iOS
1. Navigate to https://aws.amazon.com/mobile/sdk/ and download the 'iOS SDK'
1. Inside your application's iOS directory right-click and create a folder called Frameworks.
1. Drag AWSCore.framework and AWS<InsertServiceName>.framework into the folder you just created
1. Open Xcode to your application's .xcodeproj inside your application's iOS directory
1. right-click on your project inside the Project Navigator and create a new group. Call this Frameworks as well.
1. Drag the two Frameworks from step 3 into this Frameworks folder as well. 
1. Check copy files if needed. 
1. Click on your project name inside the Project Navigator. It should be at the very top. 
1. On the right click on general inside the navigation bar listing general, capabilites, resource tags, etc. 
1. Delete the frameworks from linked Frameworks and Libraries, and then add it in embedded Binaries. It will self add in linked Frameworks and Libraries.
1. Change your project to be built for 8.0 if not already higher. 
1. scroll down and click the '+' and select the two frameworks you just added. 
1. right click Libraries in your Project Navigator and select "Add Files to "YourProjectName"..."
1. Navigate to the route of your folder/node_modules/aws-sdk-react-native-core/ios/Core.xcodeproj. add the .xcodeproj
1. Repeat the above for the service you've added
1. Go back to where you cliked the '+' in step 10 and scroll down more. In Linked Frameworks and Libraries click the '+'. Add the relevant .a files for core and the service you have added. 

###link to android
1. Open Android Studio to your application's android directory
1. Add the following to your 'settings.gradle'
    include ':aws-sdk-react-native-<InsertServiceName>'
    project(':aws-sdk-react-native-<InsertServiceName>').projectDir = new File(rootProject.projectDir, '../node_modules/aws-sdk-react-native-<InsertServiceName>/android')
    include ':aws-sdk-react-native-core'
    project(':aws-sdk-react-native-core').projectDir = new File(rootProject.projectDir, '../node_modules/aws-sdk-react-native-core/android')
1. Add the following to your dependencies inside the 'build.gradle' for your app. dependencies are located at the bottom. 
    compile project(':aws-sdk-react-native-<InsertServiceName>')
    compile project(':aws-sdk-react-native-core')
1. Select sync now on the yellow banner that should appear above when you edited the gradle files.
1. Navigate to the build.gradle for the package of the service you got aws-sdk-react-native-<InsertServiceName>
1. Navigate and click Tools > Android > Sync Project with Gradle Files
1. Go to app/java/YourApp/MainApplication.java. 
1. At the top add:
    import com.amazonaws.reactnative.core.CorePackage
    import com.amazonaws.reactnative.core.<InsertServicePackageName>
1. In the 'getPackages' method, change getPackages to:
    @Override
    protected List<ReactPackage> getPackages() {
        FacebookSdk.sdkInitialize(getApplicationContext());
        return Arrays.<ReactPackage>asList(
            new MainReactPackage(),
            new CorePackage(), //add this
            new <InsertServicePackageName>() //add this
        );
    }
* Note that the <InsertServicePackageName> will not be lowercase like <InsertServiceName> and the first letter will be capital
dynamodb --> DynamoDBPackage
s3 --> S3Package
sns --> SNSPackage
lambda --> LambdaPackage


##Running the high level client example applications

The currently supported high level clients are core and TransferUtility. For both of these, you will need to: 
1. Set up the relevant resources
* Transfer Utility will require a bucket with some file, preferably larger than 20mb, that you keep there. It will also require Cognito that allows unauthenticated access with the IAM role having permissions to the bucket you created.
* Core will require setup with a Federated Identity from the Cognito homepage. Allow unauthenticated access and enter your facebook app ID (refer to below).  
1. navigate to the respective folder/example/app/index.js At the top, you will see prompts to enter information. 
1. For TransferUtility, this is enough. For Core you will have to create a facebook application. Navigate to the [Facebook Developer Homepage](https://developers.facebook.com/) for more information. 
1. For iOS insert your created facebook app id in BOTH prompts inside the info.plist file located at example/ios/example/info.plist 
1. For Android, insert your created facebook app id in example/android/app/src/res/values/strings.xml. 
1. Run android with 
    $ react-native run-android
1. Run iOS by opening up the xcodeproj file and pressing play. 

##Testing the low level clients
1. Create the relevant resources
1. All services need Cognito, so you will need to grant unauthenticated access to the services. Refer to IAM roles and Cognito for more information. 
1. navigate to the folder/IntegrationTests/<InsertServiceName>Tests.js file.
1. At the top you will notice some prompts that are something like this: “INSERTSOMETHINGHERE”. You will need to fill this information according to the resources you created in step 1. 

###Running the tests for android:

1. run the application with “react-native run-android” inside the IntegrationTests directory.
1. Using Android Studio open the relevant android/ directory. 
1. run the testing file, Tests.java, inside the androidTest directory after the previous step has completed. 
Note: If you change the tests, please run “react-native run-android” to reload the javascript files before running the Tests.java file inside the androidTest directory. 

###Running the tests for iOS:

1. open the relevant Xcode project
1. command+U or Product —> Test will start tests in Xcode. Sometimes the development server can take a while so it can be helpful to run the application normally (by pressing the Run button at the top) and then invoke the tests with either command+U or Product —> Test

### License

The source code is available under the Apache 2.0 license.
