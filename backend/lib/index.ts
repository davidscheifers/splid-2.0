import 'reflect-metadata';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RdsDatabase } from './rds/rds';
import { ApiGateway } from './api-gateway/api-gateway';
import { IApiGatewayStackProps } from '../bin/stack-config-types';

export class MyAppStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: IApiGatewayStackProps) {
        super(scope, id, props);

    // The RDS database
    new RdsDatabase(this, 'MyRdsDatabase', props);

     // The API Gateway
     new ApiGateway(this, 'MyApiGateway', props);

    // The Lambda functions

   
  }
}