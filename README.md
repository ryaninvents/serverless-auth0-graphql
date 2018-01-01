# serverless-auth0-graphql
Basic application scaffold using Serverless Framework, AWS Lambda, GraphQL, and Auth0. Requires local Node >= 8.

## Deploying
Create a new Auth0 client. Run `npm run create-secrets-files`; edit `vars.json` and `secrets.json` with the credentials provided by Auth0.

Run `npm run create-asset-bucket -- $BUCKET_NAME`, substituting the name of your static-assets bucket for `$BUCKET_NAME`. `$BUCKET_NAME` must not contain the dot (`.`) character to ensure that the S3 endpoint has the correct TLS certificate (see [this StackOverflow question](https://stackoverflow.com/questions/32714351/amazon-s3-using-dns-alias-to-bucket-https-at-the-same-time) for details).

Run `serverless deploy`.

Once the deployment has finished, run `sls info --verbose` (or check `stack.json`) for the value of `WebAppCloudFrontDistributionOutput`. Update the client settings in Auth0 for "Allowed Callback URLs", "Allowed Web Origins", "Allowed Logout URLs", and "Allowed Origins (CORS)" to match the origin (note: it is required to add the "https://" to the origin in the Auth0 settings).

### Troubleshooting deployment

#### Error: `The specified bucket does not exist`

This might occur if resources were modified outside of the Serverless framework. To resolve, try visiting [the CloudFormation console](https://console.aws.amazon.com/cloudformation/home?region=us-east-1#/stacks?filter=active) and seeing if there is any information about the given stack.
