#!/usr/bin/env node
const AWS = require('aws-sdk');

const BUCKET_NAME = process.argv[2];

(async function() {
    const s3 = new AWS.S3();
    try {
        console.log(await s3.headBucket({
            Bucket: BUCKET_NAME,
        }).promise());
    } catch (err) {
        if (err.statusCode === 404) {
            console.log(`Creating bucket "${BUCKET_NAME}"...`);
            await s3.createBucket({
                Bucket: BUCKET_NAME,
            }).promise();
        } else {
            throw err;
        }
    }
    console.log(`Updating ACL...`);
    await s3.putBucketAcl({
        Bucket: BUCKET_NAME,
        ACL: 'public-read',
    }).promise();
    console.log(`Setting bucket policy...`);
    await s3.putBucketPolicy({
        Bucket: BUCKET_NAME,
        Policy: JSON.stringify({
            Version: '2012-10-17',
            Statement: [{
                Sid: 'PublicReadGetObject',
                Effect: 'Allow',
                Principal: '*',
                Action: ['s3:GetObject'],
                Resource: `arn:aws:s3:::${BUCKET_NAME}/*`,
            }],
        })
    }).promise();
    console.log(`Setting bucket website configuration...`);
    await s3.putBucketWebsite({
        Bucket: BUCKET_NAME,
        WebsiteConfiguration: {
          ErrorDocument: {
            Key: "index.html"
          }, 
          IndexDocument: {
            Suffix: "index.html"
          }
        }
    }).promise();
    console.log('Done.');
})();