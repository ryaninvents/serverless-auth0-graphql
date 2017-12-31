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
    console.log('Done.');
})();