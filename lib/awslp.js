"use strict";

const AWS = require("aws-sdk");
const credentialsjson = ".credentials.json";
/** Priority order for loading credentials
  * 1. ./.credentials.json
  * 2. Environment variable (only when both AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY is set)
  * 3. ~/.aws/credentials
  *
  * Note: Order of 2 and 3 is default behaviour of aws-sdk
  */
function hasEnvCredentials() {
  return process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;
}
function hasLocalCredentials() {
  const fs = require("fs");
  return fs.existsSync(credentialsjson);
}
function initCredentials() {
  if (hasLocalCredentials()) {
    console.log("Loading credentials from ./.credentials.json...");
    AWS.config.loadFromPath(`./${credentialsjson}`);
  } else if (hasEnvCredentials()) {
    console.log("Loading credentials from environment variables...");
  } else {
    console.log("Loading credentials from ~/.aws/credentials...");
  }
}

function createBucket(bucket) {
  const S3 = new AWS.S3();
  return S3.createBucket({Bucket: bucket}).promise().then(data => {
    console.log("S3 successfully created", data);
    return bucket;
  }).catch(e => {
    console.log("Create S3 throw Exception", e, e.stack);
    return null;
  });
}
function putBucketPolicy(bucket) {
  const S3 = new AWS.S3();
  const policy = {
    Version: "2012-10-17",
    Statement: [{
      Sid:"PublicReadGetObject",
      Effect:"Allow",
      Principal: "*",
      Action:["s3:GetObject"],
      Resource: [`arn:aws:s3:::${bucket}/*`]
    }]
  };
  return S3.putBucketPolicy({
    Bucket: bucket,
    Policy: JSON.stringify(policy)
  }).promise().then(data => {
    console.log("S3 policy successfully updated", data);
    return bucket;
  }).catch(e => {
    console.log("Update S3 policy throw Exception", e, e.stack);
  });
}

initCredentials();
let bucket = "sandbox-awslp";
createBucket(bucket)
  .then(putBucketPolicy)
  .catch(e => {
    console.log("Top level exeption:", e);
  });

module.exports = {};
