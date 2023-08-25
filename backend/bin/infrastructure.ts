#!/usr/bin/env node
import 'reflect-metadata';
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { SplidStack } from '../lib/infrastructure-stack';
import environmentConfig from './stack-config';

const app = new cdk.App();
new SplidStack(app, 'MyAppStack', environmentConfig);




