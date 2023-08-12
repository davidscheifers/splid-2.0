# Splid 2.0 Frontend Documentation

## CDK Deployment

### CDK S3 Bucket setup

```javascript
import * as cdk from "aws-cdk-lib";
import * as s3 from "aws-cdk-lib/aws-s3";
import * as cloudfront from "aws-cdk-lib/aws-cloudfront";

export class ReactAppStack extends cdk.Stack {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

        // Create an S3 bucket to store the React app files
        const bucket = new s3.Bucket(this, "ReactAppBucket", {
            websiteIndexDocument: "index.html",
            publicReadAccess: true,
        });

        // Create a CloudFront distribution to serve the React app from S3
        new cloudfront.CloudFrontWebDistribution(this, "ReactAppDistribution", {
            originConfigs: [
                {
                    s3OriginSource: {
                        s3BucketSource: bucket,
                    },
                    behaviors: [{ isDefaultBehavior: true }],
                },
            ],
        });

        // Output the S3 bucket URL
        new cdk.CfnOutput(this, "ReactAppBucketURL", {
            value: bucket.bucketWebsiteUrl,
        });
    }
}
```

### Github action deployment

```yaml
name: Deploy React App with CDK

on:
    push:
        branches:
            - main

jobs:
    deploy:
        runs-on: ubuntu-latest

        steps:
            - name: Checkout Repository
              uses: actions/checkout@v2

            - name: Set up Node.js
              uses: actions/setup-node@v2
              with:
                  node-version: 14

            - name: Install Dependencies
              run: npm install

            - name: Deploy CDK Stack
              run: npx cdk deploy --require-approval never
              env:
                  AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
                  AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
```
