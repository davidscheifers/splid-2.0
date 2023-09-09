import { Template } from "aws-cdk-lib/assertions";
import * as cdk from "aws-cdk-lib";
import { IamConstruct } from "../lib/iam/iam-construct";

describe("IamConstruct", () => {
  let stack: cdk.Stack;

  beforeEach(() => {
    const app = new cdk.App();
    stack = new cdk.Stack(app, "TestStack");
    new IamConstruct(stack, "TestIamConstruct");
  });

  test("creates an IAM role", () => {
    const template = Template.fromStack(stack);
    template.resourceCountIs("AWS::IAM::Role", 1);
    template.hasResourceProperties("AWS::IAM::Role", {
      RoleName: "rds-role",
      Description: "Role used in the RDS construct",
      AssumeRolePolicyDocument: {
        Statement: [
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "ec2.amazonaws.com",
            },
          },
          {
            Action: "sts:AssumeRole",
            Effect: "Allow",
            Principal: {
              Service: "lambda.amazonaws.com",
            },
          },
        ],
      },      
    });
  });

  test("IAM role has correct permissions", () => {
    const template = Template.fromStack(stack);
    template.hasResourceProperties("AWS::IAM::Policy", {
        PolicyDocument: {
            Statement: [
              {
                Effect: "Allow",
                Action: [
                  "cloudwatch:PutMetricData",
                  "ec2:CreateNetworkInterface",
                  "ec2:DescribeNetworkInterfaces",
                  "ec2:DeleteNetworkInterface",
                  "ec2:DescribeInstances",
                  "ec2:DescribeSubnets",
                  "ec2:DescribeSecurityGroups",
                  "ec2:DescribeRouteTables",
                  "logs:CreateLogGroup",
                  "logs:CreateLogStream",
                  "logs:PutLogEvents",
                  "lambda:InvokeFunction",
                  "secretsmanager:GetSecretValue",
                  "kms:decrypt",
                  "rds-db:connect",
                ],
                Resource: "*",
              },
            ],
          },          
    });
  });
});
