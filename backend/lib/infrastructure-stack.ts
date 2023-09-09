import "reflect-metadata";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import path = require("path");
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secrets from "aws-cdk-lib/aws-secretsmanager";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as cr from "aws-cdk-lib/custom-resources";
import { IApiGatewayStackProps, IValidators } from "../bin/stack-config-types";
import { get } from "http";
import { VpcConstruct } from "./vpc/vpc-construct";
import { IamConstruct } from "./iam/iam-construct";
import { RdsConstruct } from "./rds/rds-construct";
import { ApiConstruct } from "./api/api-construct";

export class SplidStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IApiGatewayStackProps) {
    super(scope, id, props);
    
    const vpcConstruct = new VpcConstruct(this, 'VpcConstruct');
    
    const iamConstruct = new IamConstruct(this, "IamConstruct",);
    
    const rdsConstruct = new RdsConstruct(this, 'RdsConstruct', {
      vpc: vpcConstruct.vpc,
      securityGroup: vpcConstruct.securityGroupRds,
      role: iamConstruct.role
    });

    const apiConstruct = new ApiConstruct(this, 'ApiConstruct', {
      vpc: vpcConstruct.vpc,
      securityGroup: vpcConstruct.securityGroupResolvers,
      role: iamConstruct.role,
      rdsInstance: rdsConstruct.rdsInstance,
      config: props,
      credentials: rdsConstruct.credentials
    });

  }
}
