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

const S3 = new AWS.S3();
let bucket = "takayukioda-awslp";
S3.createBucket({Bucket: bucket}).promise().then((err, data) => {
  if (err) {
    return console.error("Error", err);
  }
  console.log("S3 successfully created");
  console.log(data);
}).catch(e => {
  console.log("Exception has thrown", e);
});

initCredentials();

module.exports = {};
