#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {Tags} from 'aws-cdk-lib';
import {AwsInfraCdkStack} from '../lib/aws-infra-cdk-stack';

const app = new cdk.App();
const awsInfraCdkStack = new AwsInfraCdkStack(app, 'AwsInfraCdkStack', {});

Tags.of(awsInfraCdkStack).add("App", "DocumentManagement");
Tags.of(awsInfraCdkStack).add("Environment", "Development");