To setup the sample project for cognito identity using react native, use the following instructions: 

Both iOS and Android:
- Create a Facebook application on developers.Facebook.com
- go to https://console.aws.amazon.com/ and go to cognito —> manage federated identities and create your own identity pool and allow for unauthenticated and authenticated identities. Add Facebook as an option for this identity pool
- Go to example —> app —> index.js and fix line 145 with your identity pool and region info: CognitoAWSCredentials.initWithOptions(….)

iOS Project
- Go to example —> info.plist —> open as —> source code and change BOTH instances of INSERTFACEBOOKAPPID to your appID

Android Project
- Go to app —> res —> values —> strings.xml and change the INSERTFACEBOOKAPPID to your appID

