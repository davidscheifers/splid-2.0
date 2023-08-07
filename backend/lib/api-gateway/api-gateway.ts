
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as cdk from 'aws-cdk-lib';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import { IApiGatewayStackProps, IValidators } from '../../bin/stack-config-types'
import { Lambda } from 'aws-sdk';
import path = require('path');


export class ApiGateway extends Construct {
    constructor(scope: Construct, id: string, props: IApiGatewayStackProps) {
        super(scope, id);

    //      // Lambda for resolving API requests
    // const resolver = new lambda.Function(this, 'LambdaResolver', {
    //     functionName: props.lambda.name,
    //     description: props.lambda.desc,
    //     handler: 'index.handler',
    //     code: new lambda.AssetCode('dist/src'),
    //     runtime: lambda.Runtime.NODEJS_18_X,
    //     memorySize: props.lambda.memory,
    //     timeout: cdk.Duration.seconds(props.lambda.timeout),
    //   });
  
    //   const integration = new apigateway.LambdaIntegration(resolver);

      //group Resolvers

      const getGroupsResolver = new NodejsFunction(this, 'getGroupsResolver', {
        entry: path.join(__dirname, '../../src/groups/getGroups.ts'),
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        memorySize: props.lambda.memory,
        timeout: cdk.Duration.seconds(props.lambda.timeout),
      });
      const getGroupIntegration = new apigateway.LambdaIntegration(getGroupsResolver);
  
      // API Gateway RestApi
      const api = new apigateway.RestApi(this, 'RestAPI', {
        restApiName: props.api.name,
        description: props.api.desc,
        defaultCorsPreflightOptions: {
          allowOrigins: apigateway.Cors.ALL_ORIGINS,
          allowMethods: ['GET', 'POST', 'PATCH', 'DELETE']
        },
      });
      
      // Request Validators
      const createValidator = (input: IValidators) => new apigateway.RequestValidator(
        this,
        input.requestValidatorName,
        {
          restApi: api,
          requestValidatorName: input.requestValidatorName,
          validateRequestBody: input.validateRequestBody,
          validateRequestParameters: input.validateRequestParameters,
        },
      );
  
      const bodyValidator = createValidator(props.validators.bodyValidator);
      const paramValidator = createValidator(props.validators.paramValidator);
      const bodyAndParamValidator = createValidator(props.validators.bodyAndParamValidator);
  
      // API Gateway Model
      const model = new apigateway.Model(this, 'Model', {
        modelName: props.api.modelName,
        restApi: api,
        schema: {
          type: apigateway.JsonSchemaType.OBJECT,
          required: ['name'],
          properties: {
            name: { type: apigateway.JsonSchemaType.STRING },
          },
        },
      });
  
      // Root Resources 
      const rootResource = api.root.addResource(props.api.rootResource);
  
      // Secure Resources and Methods
      const secureResource = rootResource.addResource('secure');
      const paramResource = secureResource.addResource('{param}');

      //group ressources and methods
      const groupResource =  secureResource.addResource('groups');

      groupResource.addMethod('GET', getGroupIntegration, {
        requestModels: { 'application/json': model },
      });

      // API Usageplan
      const usageplan = api.addUsagePlan('UsagePlan', {
        name: props.usageplan.name,
        description: props.usageplan.desc,
        apiStages: [{
          api: api,
          stage: api.deploymentStage,
        }],
        quota: {
          limit: props.usageplan.limit,
          period: apigateway.Period.DAY,
        },
        throttle: {
          rateLimit: props.usageplan.rateLimit,
          burstLimit: props.usageplan.burstLimit,
        },
      });
  
      // API Key for authorization
      const apiKey = api.addApiKey('ApiKey', {
        apiKeyName: props.apiKey.name,
        description: props.apiKey.desc,
      });
      
      usageplan.addApiKey(apiKey);
    }    
}
