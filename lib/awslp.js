"use strict";

const AWS = require("aws-sdk");
const path = require("path");
const fs = require("fs");

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
      console.log(`${bucket}: bucket not exists`, data);
      return bucket;
    }).catch(e => {
      console.log(`${bucket}: bucket exists`);
      throw e;
    });
}
function bucketExists(bucket) {
  return S3.waitFor("bucketExists", {Bucket: bucket})
    .promise()
    .then(data => {
      console.log(`${bucket}: bucket exists`, data);
      return bucket;
    }).catch(e => {
      console.log(`${bucket}: bucket not exists`);
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
function putBucketWebsite(bucket) {
  const params = {
    Bucket: bucket,
    WebsiteConfiguration: {
      IndexDocument: {
        Suffix: "index.html"
      }
    }
  };
  return S3.putBucketWebsite(params).promise().then(data => {
    console.log("Bucket website configuration completed", data);
    return bucket;
  }).catch( e => {
    console.log("Update S3 website configuration throw Exception");
    throw e;
  });
}

function createDistribution(bucket) {
  const conf = require("./distribution.json")(bucket);
  return CloudFront.createDistribution(conf).promise().then(data => {
    console.log("CloudFront distribution created", data);
    return data;
  }).catch(e => {
    console.log("Creating CloudFront distribution throw Exception");
    throw e;
  });
}

function putObject(bucket, path) {
  const params = {
    Bucket: bucket,
    Key: path,
    Body: fs.createReadStream(path)
  };

  return S3.putObject(params).promise().then(data => {
    console.log("S3 put object succeed", data);
    return data;
  }).catch(e => {
    console.log("Uploading file to S3 throw Exception");
    throw e;
  });
}

function initializelp(bucket) {
  return bucketNotExists(bucket)
    .then(createBucket)
    .then(bucketExists)
    .then(putBucketPolicy)
    .then(putBucketWebsite)
    .then(createDistribution)
    .catch(e => {
      console.log("Initialize lp top level exeption:", e);
    });
}
initCredentials();
const S3 = new AWS.S3();
const CloudFront = new AWS.CloudFront();

let bucket = "sandbox-awslp";
let srcpath = "./dist";
initializelp(bucket);
putObject(bucket, path.resolve(srcpath));


module.exports = {};
