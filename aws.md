
# Manual AWS Setup

This file describes how the Amplify project was set up from scratch. This is saved for debugging purposes in the future, you don't need to follow these instructions if you follow those in the README.

Still a WIP, some old instructions are left behind.

0. Prereq: Install the [aws amplify CLI](https://docs.amplify.aws/cli/start/install)
1. Run `amplify configure`
2. Run `amplify add auth`
   - Default configuration
   - Email
   - No additional changes
3. Run `amplify add api`
   - GraphQL
   - Default Authorization Type: IAM
   - Yes, I want to make some additional changes
   - Configure Additional Auth types? `y`
   - Hit 'Space' on Amazon Cognito User Pool to select it, then hit 'enter'
   - Configure conflict detection? `N`
   - Do you have an annotated GraphQL Schema? `No`
   - Do you want a guided schema creation? `Yes`
   - What best describes: `Single object with fields`
   - Edit Schema now? `Yes`
   - Then, paste the contents of the `schema.graphql` found in this repo. Only include the `Post` object though; don't add the `CreatePostInput` or the `BatchAddPost`.
   - Back to CLI. hit enter
4. Run `amplify update auth`
   - What do you want to do? `Walkthrough all the auth configurations`
   - Select the authn/authz services: `User Sign-Up, Sign-In, connected with AWS IAM controls (Enables per user Storage ...)`
   - Allow unauthenticated logins? `Yes`
   - 3rd party authn providers? `No`
   - Add User Pool Groups? `No`
   - Admin queries API? `No`
   - MFA? `OFF`
   - Email based user registration / forgot password: `Enabled`
   - Specify email stuff: hit enter on all of them
   - Override pw policy? `N`
   - Refresh token expiration: `30`
   - Specify user attributes they can read/write: `N`
   - Enable any of the following? None, hit 'enter'
   - Oauth? `N`
   - Lambda Triggers for Cognito? `N`
5. Run `amplify add function`

   - Choose a friendly name
   - Choose the official name
   - `NodeJS`
   - `Lambda Trigger`
   - `DynamoDB`
   - `Use API category graphql model`
   - Other resources? `N`
   - Recurring? `N`
   - Edit Now? `Y` -> Paste the code found in `amplify/backend/functions/editPostLambda/src/index.js`. Don't include the DO NOT EDIT stuff. Make sure to update the name of the table in the variable `POSTS_TABLE_NAME` with your own DynamoDB table ID.

6. Run `amplify push`

   - Generate code? `Y`
   - `Typescript`
   - Hit enter
   - Generate/update all? `Y`
   - Maximum statement depth: 2
   - File name: hit enter

<!-- TODO: Change this step to use CLI -->

7. Give the `addLinkTitle` lambda trigger function permission to edit the DynamoDB table. This way, the lambda function can automatically add the title to newly saved links.

   - Go to your AWS Amplify console at `http://console.aws.amazon.com/amplify`.
   - Click on your project name, in this case `links`.
   - Click on `Backend environments`. Then click on the one environment we have so far, in this case `dev` (yes, you're testing in prod / users are in dev)
   - Select the tab `Functions`. With the `addLinkTitle` selected, click on `View in Lambda`.
   - Select the `Permissions` tab.
   - Click the hyperlinked role name under "Role name" to go to the Lambda's Execution Role (which determines its security access) in IAM.
   - In the drop down menu named `Resource summary`, you'll see 2 options: Amazon CloudWatch logs and Amazon DynamoDB. Edit the permissions to allow read/write access to both of these resources.
