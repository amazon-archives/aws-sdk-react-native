To setup the sample project for S3 using react native, use the following instructions:
FOR BOTH iOS and ANDROID:
Set up Cognito for federated identities. Allow unauthenticated identities. 
Set up an S3 bucket. Submit some file that is large enough to be downloaded slowly. (20MB)
Allow your unauthenticated identity for Cognito to access the bucket you createdusing IAM.

Android:
go to the build.gradle for the S3 portion and sync

JAVASCRIPT:
Insert bucket, key, identity pool, and region where prompted
