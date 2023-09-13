import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secrets from 'aws-cdk-lib/aws-secretsmanager';
import { IApiGatewayStackProps, IValidators } from '../../bin/stack-config-types';

/**
 * Properties required to initialize the ApiConstruct.
 * 
 * @property vpc - The VPC in which the Lambda function and RDS instance operate.
 * @property securityGroup - The security group for the Lambda function.
 * @property role - The IAM role for the Lambda function.
 * @property rdsInstance - The RDS instance associated with the Lambda function.
 * @property credentials - The secret containing RDS credentials.
 * @property config - Configuration for the API Gateway.
 */
export interface ApiConstructProps {
  vpc: ec2.IVpc;
  securityGroup: ec2.ISecurityGroup;
  role: iam.IRole;
  rdsInstance: rds.DatabaseInstance;
  credentials: secrets.ISecret;
  config: IApiGatewayStackProps;
}

/**
 * ApiConstruct creates an API Gateway with Lambda integrations to perform CRUD operations on database resources.
 * 
 * The construct:
 * - Initializes multiple Lambda functions using Node.js runtime, each serving different API endpoints.
 * - Each Lambda function is provided with environment variables to connect to the RDS instance.
 * - Sets up an API Gateway with CORS enabled and integrates the Lambda functions.
 * - Configures API Gateway resources and methods for the CRUD operations.
 * - Sets up API usage plans and API keys for client access.
 */
export class ApiConstruct extends Construct {
  public readonly rdsInstance: rds.DatabaseInstance;

  constructor(scope: Construct, id: string, props: ApiConstructProps) {
    super(scope, id);

    // Helper function to create a Lambda function with RDS integration.
    const createResolver = (name: string, entry: string) =>
      new nodejs.NodejsFunction(this, name, {
        functionName: name,
        entry: entry,
        bundling: {
          externalModules: ["pg-native"],
        },
        runtime: lambda.Runtime.NODEJS_18_X,
        timeout: cdk.Duration.minutes(2),
        role: props.role,
        vpc: props.vpc,
        vpcSubnets: { subnets: props.vpc.isolatedSubnets },
        securityGroups: [props.securityGroup],
        environment: {
          RDS_ARN: props.rdsInstance.secret!.secretArn,
          CREDENTIALS_ARN: props.credentials.secretArn,
          HOST: props.rdsInstance.dbInstanceEndpointAddress,
        },
      });

    const configurations = [
      { name: "getGroups", path: "src/groups/getGroups.ts" },
      { name: "getGroupDetails", path: "src/groups/getGroupDetails.ts" },
      { name: "getExpensesFromGroupUser", path: "src/groups/getExpensesFromGroupUser.ts" },
      { name: "getIncomesFromGroupUser", path: "src/groups/getIncomesFromGroupUser.ts" },
      { name: "addGroup", path: "src/groups/addGroup.ts" },
      { name: "deleteGroup", path: "src/groups/deleteGroup.ts" },
      { name: "updateGroup", path: "src/groups/updateGroup.ts" },
      { name: "searchGroupOfUser", path: "src/groups/searchGroupOfUser.ts" },
      { name: "getTransactionsFromGroup", path: "src/groups/getTransactionsFromGroup.ts" },

      { name: "getUserInfo", path: "src/users/getUserInfo.ts" },
      { name: "getGroupsFromUser", path: "src/users/getGroupsFromUser.ts" },
      { name: "addUser", path: "src/users/addUser.ts" },

      { name: "getAccountingFromGroup", path: "src/accounting/getAccountingFromGroup.ts" },
      { name: "getSettlingDebtsTransactions", path: "src/accounting/getSettlingDebtsTransactions.ts" },
      { name: "getTransactionById", path: "src/transactions/getTransactionById.ts" },

      { name: "createTransaction", path: "src/transactions/createTransactions.ts" },
      { name: "deleteTransaction", path: "src/transactions/deleteTransaction.ts" },
      { name: "updateTransaction", path: "src/transactions/updateTransaction.ts" },

      { name: "initTestData", path: "src/utils/init-test-data.ts"}
    ];

     // Create Lambda functions and API Gateway integrations.
    const resolvers: { [key: string]: cdk.aws_lambda_nodejs.NodejsFunction } = {};
    const integrations: { [key: string]: apigateway.LambdaIntegration } = {};

    configurations.forEach(config => {
      resolvers[config.name + 'Resolver'] = createResolver(config.name + 'Resolver', config.path);
      resolvers[config.name + 'Resolver'].node.addDependency(props.rdsInstance);

      integrations[config.name + 'Integration'] = new apigateway.LambdaIntegration(
        resolvers[config.name + 'Resolver']
      );
    });

    // API Gateway RestApi
    const api = new apigateway.RestApi(this, "RestAPI", {
      restApiName: props.config.api.name,
      description: props.config.api.desc,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
      },
    });

    // Request Validators
    const createValidator = (input: IValidators) =>
      new apigateway.RequestValidator(this, input.requestValidatorName, {
        restApi: api,
        requestValidatorName: input.requestValidatorName,
        validateRequestBody: input.validateRequestBody,
        validateRequestParameters: input.validateRequestParameters,
      });

    const bodyValidator = createValidator(props.config.validators.bodyValidator);
    const paramValidator = createValidator(props.config.validators.paramValidator);
    const bodyAndParamValidator = createValidator(
      props.config.validators.bodyAndParamValidator
    );

    // API Gateway Model
    const model = new apigateway.Model(this, "Model", {
      modelName: props.config.api.modelName,
      restApi: api,
      schema: {
        type: apigateway.JsonSchemaType.OBJECT,
        required: ["name"],
        properties: {
          name: { type: apigateway.JsonSchemaType.STRING },
        },
      },
    });

    //FOR ENDPOINTS

    // Root Resources
    const rootResource = api.root.addResource(props.config.api.rootResource);

    // Secure Resources and Methods
    const secureResource = rootResource.addResource("secure");
    const paramResource = secureResource.addResource("{param}");

    //adding test data
    const initTestDataResource = paramResource.addResource("init");

    //group ressources 
    const groupResource =  secureResource.addResource('Groups');
    const groupIdResource = groupResource.addResource('{groupId}');

    const groupSearchResource = groupResource.addResource("search");
    const groupIdTransactionsResource = groupIdResource.addResource("transactions");

    const groupIdUsersResource = groupIdResource.addResource("users");
    const groupIddetailsResource = groupIdResource.addResource("details");

    const groupIdUsersUsernameResource = groupIdUsersResource.addResource("{username}");

    const groupIdUsersUsernameExpenseResource = groupIdUsersUsernameResource.addResource("expense");
    const groupIdUsersUsernameIncomeResource = groupIdUsersUsernameResource.addResource("income");

    //user ressources 
    const userResource = secureResource.addResource('User');
    const userUsernameResource = userResource.addResource('{username}');

    const userUsernameGroupsResource = userUsernameResource.addResource('groups');

    //accounting ressources

    const accountingResource = secureResource.addResource('Accounting');
    const accountingGroupIdResource = accountingResource.addResource('{groupId}');

    const accountingGroupIdSettledebtsResource = accountingGroupIdResource.addResource('settle-debts');

    //transaction ressources

    const transactionResource = secureResource.addResource('Transactions');
    const transactionIdResource = transactionResource.addResource('{transactionId}');

    //init
    groupResource.addMethod('GET', integrations['initTestDataIntegration'], {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });

    //group methods
    groupResource.addMethod('GET', integrations['getGroupIntegration'], {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });
    groupResource.addMethod("POST", integrations['addGroupIntegration'], {
      requestModels: { "application/json": model },
      apiKeyRequired: true,
    });

    groupIdResource.addMethod("DELETE", integrations['deleteGroupIntegration'], {
      requestModels: { "application/json": model },
      apiKeyRequired: true,
    });

    groupIddetailsResource.addMethod("GET", integrations['getGroupDetailsIntegration'], {
      requestModels: { "application/json": model },
      apiKeyRequired: true,
    });

    groupIdUsersUsernameExpenseResource.addMethod("GET", integrations['getExpansesFromGroupUserIntegration'], {
        requestModels: { "application/json": model },
        apiKeyRequired: true,
      }
    );

    groupIdUsersUsernameIncomeResource.addMethod("GET", integrations['getIncomesFromGroupUserIntegration'], {
        requestModels: { "application/json": model },
        apiKeyRequired: true,
      }
    );

    groupSearchResource.addMethod("GET", integrations['searchGroupOfUserIntegration'], {
      requestModels: { "application/json": model },
      apiKeyRequired: true,
    });

    groupResource.addMethod("PUT", integrations['updateGroupIntegration'], {
      requestModels: { "application/json": model },
      apiKeyRequired: true,
    });

    groupIdTransactionsResource.addMethod('GET', integrations['getTransactionsFromGroupIntegration'], {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });
    
    //user methods

    userUsernameResource.addMethod('GET', integrations['getUserInfoIntegration'], {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });

    userUsernameGroupsResource.addMethod('GET',integrations['getGroupsFromUserIntegration'], {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });

    userResource.addMethod('POST', integrations['addUserIntegration'], {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });

    //accounting methods

    accountingGroupIdResource.addMethod('GET', integrations['getAccountingFromGroupIntegration'], {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });

    accountingGroupIdSettledebtsResource.addMethod('GET', integrations['getSettlingDebtsTransactionsIntegration'], {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });
    
    //transaction methods

    transactionIdResource.addMethod('GET', integrations['getTransactionByIdIntegration'], {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });

    transactionResource.addMethod('POST', integrations['createTransactionIntegration'], {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });

    transactionIdResource.addMethod('DELETE', integrations['deleteTransactionIntegration'], {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });

    transactionIdResource.addMethod('PUT', integrations['updateTransactionIntegration'], {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });

    // API Usageplan
    const usageplan = api.addUsagePlan("UsagePlan", {
      name: props.config.usageplan.name,
      description: props.config.usageplan.desc,
      apiStages: [
        {
          api: api,
          stage: api.deploymentStage,
        },
      ],
      quota: {
        limit: props.config.usageplan.limit,
        period: apigateway.Period.DAY,
      },
      throttle: {
        rateLimit: props.config.usageplan.rateLimit,
        burstLimit: props.config.usageplan.burstLimit,
      },
    });

    // API Key for authorization
    const apiKey = api.addApiKey("ApiKey", {
      apiKeyName: props.config.apiKey.name,
      description: props.config.apiKey.desc,
    });

    usageplan.addApiKey(apiKey);
  }

}
