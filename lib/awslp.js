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
function bucketNotExists(bucket) {
  return S3.waitFor("bucketNotExists", {Bucket: bucket})
    .promise()
    .then(data => {
      console.log("S3 bucket is free", data);
      return bucket;
    }).catch(e => {
      console.log("S3 bucket already exists");
      throw e;
    });
}
function createBucket(bucket) {
  return S3.createBucket({Bucket: bucket}).promise().then(data => {
    console.log("S3 successfully created", data);
    return bucket;
  }).catch(e => {
    console.log("Create S3 throw Exception");
    throw e;
  });
}
function putBucketPolicy(bucket) {
  const policy = require("./policy.json")(bucket);
  return S3.putBucketPolicy({
    Bucket: bucket,
    Policy: JSON.stringify(policy)
  }).promise().then(data => {
    console.log("S3 policy successfully updated", data);
    return bucket;
  }).catch(e => {
    console.log("Update S3 policy throw Exception");
    throw e;
  });
}

initCredentials();
const S3 = new AWS.S3();
let bucket = "sandbox-awslp";
bucketNotExists(bucket)
  .then(createBucket)
  .then(putBucketPolicy)
  .catch(e => {
    console.log("Top level exeption:", e);
  });

module.exports = {};
