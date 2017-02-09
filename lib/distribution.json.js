"use strict";

module.exports = bucket => ({
  "DistributionConfig": {
    "CallerReference": `${new Date().getTime()}`,
    "Comment": "",
    "DefaultCacheBehavior": {
      "ForwardedValues": {
        "Cookies": {
          "Forward": "none"
        },
        "QueryString": false,
        "Headers": { "Quantity": 0 },
        "QueryStringCacheKeys": { "Quantity": 0 }
      },
      "TargetOriginId": `S3-${bucket}`,
      "TrustedSigners": {
        "Enabled": false,
        "Quantity": 0
      },
      "ViewerProtocolPolicy": "redirect-to-https",
      "AllowedMethods": {
        "Quantity": 2,
        "Items": [ "HEAD", "GET" ],
        "CachedMethods": {
          "Quantity": 2,
          "Items": [ "HEAD", "GET" ]
        }
      },
      "Compress": false,
      "DefaultTTL": 86400,
      "MinTTL": 0,
      "MaxTTL": 31536000,
      "LambdaFunctionAssociations": { "Quantity": 0 },
      "SmoothStreaming": false
    },
    "Enabled": true,
    "Origins": {
      "Quantity": 1,
      "Items": [
        {
          "DomainName": `${bucket}.s3.amazonaws.com`,
          "Id": `S3-${bucket}`,
          "CustomHeaders": { "Quantity": 0 },
          "S3OriginConfig": {
            "OriginAccessIdentity": ""
          },
          "OriginPath": ""
        }
      ]
    },
    "Aliases": { "Quantity": 0 },
    "CacheBehaviors": { "Quantity": 0 },
    "CustomErrorResponses": { "Quantity": 0 },
    "DefaultRootObject": "index.html",
    "HttpVersion": "http2",
    "IsIPV6Enabled": false,
    "Logging": {
      "Enabled": false,
      "Bucket": "",
      "IncludeCookies": false,
      "Prefix": ""
    },
    "PriceClass": "PriceClass_All",
    "Restrictions": {
      "GeoRestriction": {
        "RestrictionType": "none",
        "Quantity": 0
      }
    },
    "ViewerCertificate": {
      "CloudFrontDefaultCertificate": true,
      "MinimumProtocolVersion": "SSLv3",
      "CertificateSource": "cloudfront"
    },
    "WebACLId": ""
  }
});
