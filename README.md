# serverless-auth0-graphql
Basic application scaffold using Serverless Framework, AWS Lambda, GraphQL, and Auth0.

## Deploying
Create a new Auth0 client. Copy `vars.example.json` as `vars.json` and copy `secrets.example.json` as `secrets.json`; edit each with the credentials provided by Auth0.

Run `serverless deploy`.

Once the deployment has finished, run `sls info --verbose` (or check `stack.json`) for the value of `WebAppCloudFrontDistributionOutput`. Update the client settings in Auth0 for "Allowed Callback URLs", "Allowed Web Origins", "Allowed Logout URLs", and "Allowed Origins (CORS)" to match the origin (note: it is required to add the "https://" to the origin in the Auth0 settings).

### Removing deployment

Before running `sls remove`, make sure you delete all contents of the static assets bucket first, or the CloudFormation stack removal will fail.

### Troubleshooting deployment

#### Error: `The specified bucket does not exist`

This might occur if resources were modified outside of the Serverless framework. To resolve, try visiting [the CloudFormation console](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks?filter=active) and seeing if there is any information about the given stack.