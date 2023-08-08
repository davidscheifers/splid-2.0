
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

      //FOR ENDPOINTS: group Resolvers

      const getGroupsResolver = new NodejsFunction(this, 'getGroupsResolver', {
        entry: path.join(__dirname, '../../src/groups/getGroups.ts'),
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        memorySize: props.lambda.memory,
        timeout: cdk.Duration.seconds(props.lambda.timeout),
      });

      const getGroupDetailsResolver = new NodejsFunction(this, 'getGroupDetails', {
        entry: path.join(__dirname, '../../src/groups/getGroupDetails.ts'),
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        memorySize: props.lambda.memory,
        timeout: cdk.Duration.seconds(props.lambda.timeout),
      });

      const getExpensesFromGroupUser = new NodejsFunction(this, 'getExpensesFromGroupUser', {
        entry: path.join(__dirname, '../../src/groups/getExpensesFromGroupUser.ts'),
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        memorySize: props.lambda.memory,
        timeout: cdk.Duration.seconds(props.lambda.timeout),
      });

      const getIncomesFromGroupUser = new NodejsFunction(this, 'getIncomesFromGroupUser', {
        entry: path.join(__dirname, '../../src/groups/getIncomesFromGroupUser.ts'),
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        memorySize: props.lambda.memory,
        timeout: cdk.Duration.seconds(props.lambda.timeout),
      });

      const addGroupResolver = new NodejsFunction(this, 'addGroup', {
        entry: path.join(__dirname, '../../src/groups/addGroup.ts'),
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        memorySize: props.lambda.memory,
        timeout: cdk.Duration.seconds(props.lambda.timeout),
      });

      const deleteGroupResolver = new NodejsFunction(this, 'deleteGroup', {
        entry: path.join(__dirname, '../../src/groups/deleteGroup.ts'),
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        memorySize: props.lambda.memory,
        timeout: cdk.Duration.seconds(props.lambda.timeout),
      });

      const updateGroup = new NodejsFunction(this, 'updateGroup', {
        entry: path.join(__dirname, '../../src/groups/updateGroup.ts'),
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        memorySize: props.lambda.memory,
        timeout: cdk.Duration.seconds(props.lambda.timeout),
      });

      const searchGroupOfUser = new NodejsFunction(this, 'searchGroupOfUser', {
        entry: path.join(__dirname, '../../src/groups/searchGroupOfUser.ts'),
        handler: 'handler',
        runtime: lambda.Runtime.NODEJS_18_X,
        memorySize: props.lambda.memory,
        timeout: cdk.Duration.seconds(props.lambda.timeout),
      });

      //FOR ENDPOINTS group Integrations

      const getGroupIntegration = new apigateway.LambdaIntegration(getGroupsResolver);
      const getGroupDetailsIntegration = new apigateway.LambdaIntegration(getGroupDetailsResolver);
      const addGroupIntegration = new apigateway.LambdaIntegration(addGroupResolver);
      const deleteGroupIntegration = new apigateway.LambdaIntegration(deleteGroupResolver);
      const getExpansesFromGroupUserIntegration = new apigateway.LambdaIntegration(getExpensesFromGroupUser);
      const getIncomesFromGroupUserIntegration = new apigateway.LambdaIntegration(getIncomesFromGroupUser);
      const searchGroupOfUserIntegration = new apigateway.LambdaIntegration(searchGroupOfUser);
      const updateGroupIntegration = new apigateway.LambdaIntegration(updateGroup);
  
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

      //FOR ENDPOINTS
  
      // Root Resources 
      const rootResource = api.root.addResource(props.api.rootResource);
  
      // Secure Resources and Methods
      const secureResource = rootResource.addResource('secure');
      const paramResource = secureResource.addResource('{param}');

      //group ressources and methods
      const groupResource =  secureResource.addResource('Groups');
      const groupIdResource = groupResource.addResource('{groupId}');

      const groupSearchResource = groupResource.addResource('search');

      const groupIdUsersResource = groupIdResource.addResource('users');
      const groupIddetailsResource = groupIdResource.addResource('details');

      const groupIdUsersUsernameResource = groupIdUsersResource.addResource('{username}');

      const groupIdUsersUsernameExpenseResource = groupIdUsersUsernameResource.addResource('expense');
      const groupIdUsersUsernameIncomeResource = groupIdUsersUsernameResource.addResource('income');

      groupResource.addMethod('GET', getGroupIntegration, {
        requestModels: { 'application/json': model },
      });
      groupResource.addMethod('POST', addGroupIntegration, {
        requestModels: { 'application/json': model },
      });

      groupIdResource.addMethod('DELETE', deleteGroupIntegration, {
        requestModels: { 'application/json': model },
      });

      groupIddetailsResource.addMethod('GET', getGroupDetailsIntegration, {
        requestModels: { 'application/json': model },
      });  

      groupIdUsersUsernameExpenseResource.addMethod('GET', getExpansesFromGroupUserIntegration, {
        requestModels: { 'application/json': model },
      });

      groupIdUsersUsernameIncomeResource.addMethod('GET', getIncomesFromGroupUserIntegration, {
        requestModels: { 'application/json': model },
      });

      groupSearchResource.addMethod('GET', searchGroupOfUserIntegration, {
        requestModels: { 'application/json': model },
      });

      groupResource.addMethod('PUT', updateGroupIntegration, {
        requestModels: { 'application/json': model },
      });


      ///api/Groups/{groupId} /details

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
