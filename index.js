"use strict";

const awslp = require("./lib/awslp");

const todo = [
  "awslp s3 create <bucket-name>",
  "awslp s3 set-policy <bucket-name>",
  "awslp s3 sync <directory> <bucket-name>",
  "awslp cf create <bucket-name>",
  "awslp cf create-invalidation <bucket-name>",
  "awslp deploy"
];

console.log("ToDo", todo);
console.log(awslp);
