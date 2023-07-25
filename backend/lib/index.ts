import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RdsDatabase } from './rds/rds';


export class MyAppStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props?: cdk.StackProps) {
        super(scope, id, props);

    // The RDS database
    new RdsDatabase(this, 'MyRdsDatabase');

    // The Lambda functions

    // The API Gateway
  }
}