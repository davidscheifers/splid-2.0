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

export interface ApiConstructProps {
  vpc: ec2.IVpc;
  securityGroup: ec2.ISecurityGroup;
  role: iam.IRole;
  rdsInstance: rds.DatabaseInstance;
  credentials: secrets.ISecret;
  config: IApiGatewayStackProps;
}

export class ApiConstruct extends Construct {
  public readonly rdsInstance: rds.DatabaseInstance;

  constructor(scope: Construct, id: string, props: ApiConstructProps) {
    super(scope, id);

    // Returns function to connect with RDS instance.
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

    //----------APIGATEWAY----------------

    //group Resolvers

    const getGroupsResolver = createResolver(
      "getGroupsResolver",
      "src/groups/getGroups.ts"
    );
    getGroupsResolver.node.addDependency(props.rdsInstance);

    const getGroupDetailsResolver = createResolver(
      "getGroupDetailsResolver",
      "src/groups/getGroupDetails.ts"
    );
    getGroupDetailsResolver.node.addDependency(props.rdsInstance);

    const getExpensesFromGroupUserResolver = createResolver(
      "getExpensesFromGroupUser",
      "src/groups/getExpensesFromGroupUser.ts"
    );
    getExpensesFromGroupUserResolver.node.addDependency(props.rdsInstance);

    const getIncomesFromGroupUserResolver = createResolver(
      "getIncomesFromGroupUser",
      "src/groups/getIncomesFromGroupUser.ts"
    );
    getIncomesFromGroupUserResolver.node.addDependency(props.rdsInstance);

    const addGroupResolver = createResolver(
      "addGroupResolver",
      "src/groups/addGroup.ts"
    );
    addGroupResolver.node.addDependency(props.rdsInstance);

    const deleteGroupResolver = createResolver(
      "deleteGroupResolver",
      "src/groups/deleteGroup.ts"
    );
    deleteGroupResolver.node.addDependency(props.rdsInstance);

    const updateGroupResolver = createResolver(
      "updateGroupResolver",
      "src/groups/updateGroup.ts"
    );
    updateGroupResolver.node.addDependency(props.rdsInstance);

    const searchGroupOfUserResolver = createResolver(
      "searchGroupOfUserResolver",
      "src/groups/searchGroupOfUser.ts"
    );
    searchGroupOfUserResolver.node.addDependency(props.rdsInstance);

    const getTransactionsFromGroupResolver = createResolver(
      "getTransactionsFromGroupResolver",
      "src/groups/getTransactionsFromGroup.ts"
    );
    getTransactionsFromGroupResolver.node.addDependency(props.rdsInstance);

    //user resolvers

    const getUserInfoResolver = createResolver('getUserInfoResolver', 'src/users/getUserInfo.ts');
    getUserInfoResolver.node.addDependency(props.rdsInstance);

    const getGroupsFromUserResolver = createResolver('getGroupsFromUserResolver', 'src/users/getGroupsFromUser.ts');
    getGroupsFromUserResolver.node.addDependency(props.rdsInstance);

    const addUserResolver = createResolver('addUserResolver', 'src/users/addUser.ts');
    addUserResolver.node.addDependency(props.rdsInstance);

    //accounting resolvers

    const getAccountingFromGroupResolver = createResolver('getAccountingFromGroupResolver', 'src/accounting/getAccountingFromGroup.ts');
    getAccountingFromGroupResolver.node.addDependency(props.rdsInstance);

    const getSettlingDebtsTransactionsResolver = createResolver('getSettlingDebtsTransactionsResolver', 'src/accounting/getSettlingDebtsTransactions.ts');
    getSettlingDebtsTransactionsResolver.node.addDependency(props.rdsInstance);

    //transaction resolvers

    const getTransactionByIdResolver = createResolver( 'getTransactionByIdResolver', 'src/transactions/getTransactionById.ts');
    getTransactionByIdResolver.node.addDependency(props.rdsInstance);

    const createTransactionResolver = createResolver( 'createTransactionResolver', 'src/transactions/createTransactions.ts');
    createTransactionResolver.node.addDependency(props.rdsInstance);

    const deleteTransactionResolver = createResolver( 'deleteTransactionResolver', 'src/transactions/deleteTransaction.ts');
    deleteTransactionResolver.node.addDependency(props.rdsInstance);

    const updateTransactionResolver = createResolver( 'updateTransactionResolver', 'src/transactions/updateTransaction.ts');
    updateTransactionResolver.node.addDependency(props.rdsInstance);

    //group Integrations

    const getGroupIntegration = new apigateway.LambdaIntegration(
      getGroupsResolver
    );
    const getGroupDetailsIntegration = new apigateway.LambdaIntegration(
      getGroupDetailsResolver
    );
    const addGroupIntegration = new apigateway.LambdaIntegration(
      addGroupResolver
    );
    const deleteGroupIntegration = new apigateway.LambdaIntegration(
      deleteGroupResolver
    );
    const getExpansesFromGroupUserIntegration =
      new apigateway.LambdaIntegration(getExpensesFromGroupUserResolver);
    const getIncomesFromGroupUserIntegration = new apigateway.LambdaIntegration(
      getIncomesFromGroupUserResolver
    );
    const searchGroupOfUserIntegration = new apigateway.LambdaIntegration(
      searchGroupOfUserResolver
    );
    const updateGroupIntegration = new apigateway.LambdaIntegration(
      updateGroupResolver
    );
    const getTransactionsFromGroupIntegration = new apigateway.LambdaIntegration(
      getTransactionsFromGroupResolver
    );

    //user Integrations

    const getUserInfoIntegration = new apigateway.LambdaIntegration(getUserInfoResolver);
    const getGroupsFromUserIntegration = new apigateway.LambdaIntegration(getGroupsFromUserResolver);
    const addUserIntegration = new apigateway.LambdaIntegration(addUserResolver);

    //accounting Integrations

    const getAccountingFromGroupIntegration = new apigateway.LambdaIntegration(getAccountingFromGroupResolver);
    const getSettlingDebtsTransactionsIntegration = new apigateway.LambdaIntegration(getSettlingDebtsTransactionsResolver);

    //transaction Integrations

    const getTransactionByIdIntegration = new apigateway.LambdaIntegration(getTransactionByIdResolver);
    const createTransactionIntegration = new apigateway.LambdaIntegration(createTransactionResolver);
    const deleteTransactionIntegration = new apigateway.LambdaIntegration(deleteTransactionResolver);
    const updateTransactionIntegration = new apigateway.LambdaIntegration(updateTransactionResolver);


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

    //group ressources 
    const groupResource =  secureResource.addResource('Groups');
    const groupIdResource = groupResource.addResource('{groupId}');

    const groupSearchResource = groupResource.addResource("search");
    const groupIdTransactionsResource = groupIdResource.addResource("transactions");

    const groupIdUsersResource = groupIdResource.addResource("users");
    const groupIddetailsResource = groupIdResource.addResource("details");

    const groupIdUsersUsernameResource =
      groupIdUsersResource.addResource("{username}");

    const groupIdUsersUsernameExpenseResource =
      groupIdUsersUsernameResource.addResource("expense");
    const groupIdUsersUsernameIncomeResource =
      groupIdUsersUsernameResource.addResource("income");

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

    //group methods
    groupResource.addMethod('GET', getGroupIntegration, {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });
    groupResource.addMethod("POST", addGroupIntegration, {
      requestModels: { "application/json": model },
      apiKeyRequired: true,
    });

    groupIdResource.addMethod("DELETE", deleteGroupIntegration, {
      requestModels: { "application/json": model },
      apiKeyRequired: true,
    });

    groupIddetailsResource.addMethod("GET", getGroupDetailsIntegration, {
      requestModels: { "application/json": model },
      apiKeyRequired: true,
    });

    groupIdUsersUsernameExpenseResource.addMethod(
      "GET",
      getExpansesFromGroupUserIntegration,
      {
        requestModels: { "application/json": model },
        apiKeyRequired: true,
      }
    );

    groupIdUsersUsernameIncomeResource.addMethod(
      "GET",
      getIncomesFromGroupUserIntegration,
      {
        requestModels: { "application/json": model },
        apiKeyRequired: true,
      }
    );

    groupSearchResource.addMethod("GET", searchGroupOfUserIntegration, {
      requestModels: { "application/json": model },
      apiKeyRequired: true,
    });

    groupResource.addMethod("PUT", updateGroupIntegration, {
      requestModels: { "application/json": model },
      apiKeyRequired: true,
    });

    groupIdTransactionsResource.addMethod('GET', getTransactionsFromGroupIntegration, {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });
    
    //user methods

    userUsernameResource.addMethod('GET', getUserInfoIntegration, {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });

    userUsernameGroupsResource.addMethod('GET', getGroupsFromUserIntegration, {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });

    userResource.addMethod('POST', addUserIntegration, {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });

    //accounting methods

    accountingGroupIdResource.addMethod('GET', getAccountingFromGroupIntegration, {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });

    accountingGroupIdSettledebtsResource.addMethod('GET', getSettlingDebtsTransactionsIntegration, {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });
    
    //transaction methods

    transactionIdResource.addMethod('GET', getTransactionByIdIntegration, {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });

    transactionResource.addMethod('POST', createTransactionIntegration, {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });

    transactionIdResource.addMethod('DELETE', deleteTransactionIntegration, {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });

    transactionIdResource.addMethod('PUT', updateTransactionIntegration, {
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
