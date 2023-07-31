#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import environmentConfig from './stack-config';
import { RdsDatabase } from '../lib/rds/rds-stack';
import { ApiGateway } from '../lib/api-gateway/api-gateway-stack';

const app = new cdk.App();

// EC2
// To-Do: atm still in the rds-stack need to outsource

// RDS
const rdsStack = new RdsDatabase(app, 'RdsDatabase', environmentConfig);

// API-GATEWAY
//const apiStack = new ApiGateway(app, 'ApiGateway', environmentConfig);



