#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MyAppStack } from '../lib/index';
import environmentConfig from './stack-config';

const app = new cdk.App();
new MyAppStack(app, 'MyAppStack', environmentConfig);




