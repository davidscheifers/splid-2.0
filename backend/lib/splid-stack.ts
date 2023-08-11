import "reflect-metadata";
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { RestApi, LambdaIntegration } from "aws-cdk-lib/aws-apigateway";
import {
  NodejsFunction,
  NodejsFunctionProps,
} from "aws-cdk-lib/aws-lambda-nodejs";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import path = require("path");
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as iam from "aws-cdk-lib/aws-iam";
import * as rds from "aws-cdk-lib/aws-rds";
import * as secrets from "aws-cdk-lib/aws-secretsmanager";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as nodejs from "aws-cdk-lib/aws-lambda-nodejs";
import * as cr from "aws-cdk-lib/custom-resources";
import { IApiGatewayStackProps, IValidators } from "../bin/stack-config-types";
import { get } from "http";

export class MyAppStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: IApiGatewayStackProps) {
    super(scope, id, props);

    // VPC for RDS and Lambda resolvers
    const vpc = new ec2.Vpc(this, "VPC", {
      vpcName: "rds-vpc",
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC, //Care with this, it's only for testing purposes
          cidrMask: 24,
          name: "rds",
        },
        {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
          name: "resolvers",
        },
      ],
    });

    // Security Groups
    const securityGroupResolvers = new ec2.SecurityGroup(
      this,
      "SecurityGroupResolvers",
      {
        vpc,
        securityGroupName: "resolvers-sg",
        description: "Security Group with Resolvers",
      }
    );
    const securityGroupRds = new ec2.SecurityGroup(this, "SecurityGroupRds", {
      vpc,
      securityGroupName: "rds-sg",
      description: "Security Group with RDS",
    });

    // IP Address for local testing
    const myIpAddress = "46.223.163.10/32";

    // Ingress and Egress Rules
    securityGroupRds.addIngressRule(
      ec2.Peer.ipv4(myIpAddress),
      ec2.Port.tcp(5432),
      "Allow inbound traffic to RDS from local"
    );

    // Ingress and Egress Rules
    securityGroupRds.addIngressRule(
      ec2.Peer.ipv4("82.207.248.40/32"),
      ec2.Port.tcp(5432),
      "Allow inbound traffic to RDS from local"
    );

    // Ingress and Egress Rules
    securityGroupRds.addIngressRule(
      securityGroupResolvers,
      ec2.Port.tcp(5432),
      "Allow inbound traffic to RDS"
    );

    // VPC Interfaces
    vpc.addInterfaceEndpoint("LAMBDA", {
      service: ec2.InterfaceVpcEndpointAwsService.LAMBDA,
      subnets: { subnets: vpc.isolatedSubnets },
      securityGroups: [securityGroupResolvers],
    });
    vpc.addInterfaceEndpoint("SECRETS_MANAGER", {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      subnets: { subnets: vpc.isolatedSubnets },
      securityGroups: [securityGroupResolvers],
    });

    // IAM Role
    const role = new iam.Role(this, "Role", {
      roleName: "rds-role",
      description: "Role used in the RDS stack",
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal("ec2.amazonaws.com"),
        new iam.ServicePrincipal("lambda.amazonaws.com")
      ),
    });
    role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "cloudwatch:PutMetricData",
          "ec2:CreateNetworkInterface",
          "ec2:DescribeNetworkInterfaces",
          "ec2:DeleteNetworkInterface",
          "ec2:DescribeInstances",
          "ec2:DescribeSubnets",
          "ec2:DescribeSecurityGroups",
          "ec2:DescribeRouteTables",
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents",
          "lambda:InvokeFunction",
          "secretsmanager:GetSecretValue",
          "kms:decrypt",
          "rds-db:connect",
        ],
        resources: ["*"],
      })
    );

    // RDS PostgreSQL Instance
    const rdsInstance = new rds.DatabaseInstance(this, "PostgresRds", {
      vpc,
      securityGroups: [securityGroupRds],
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      availabilityZone: vpc.isolatedSubnets[0].availabilityZone,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_14_6,
      }),
      port: 5432,
      instanceIdentifier: "spliddb-instance",
      allocatedStorage: 10,
      maxAllocatedStorage: 10,
      deleteAutomatedBackups: true,
      backupRetention: cdk.Duration.millis(0),
      credentials: rds.Credentials.fromUsername("splidUser"),
      publiclyAccessible: true,
    });

    rdsInstance.secret?.grantRead(role);

    // Secrets for database credentials.
    const credentials = secrets.Secret.fromSecretCompleteArn(
      this,
      "CredentialsSecret",
      "arn:aws:secretsmanager:eu-central-1:973206779484:secret:rds-db-creds-test-2RiK43"
    );
    credentials.grantRead(role);

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
        role,
        vpc,
        vpcSubnets: { subnets: vpc.isolatedSubnets },
        securityGroups: [securityGroupResolvers],
        environment: {
          RDS_ARN: rdsInstance.secret!.secretArn,
          CREDENTIALS_ARN: credentials.secretArn,
          HOST: rdsInstance.dbInstanceEndpointAddress,
        },
      });

    // Instantiate new db with user and permissions
    const instantiate = createResolver("instantiate", "src/instantiate.ts");
    instantiate.node.addDependency(rdsInstance);

    // Custom Resource to execute instantiate function.
    const customResource = new cr.AwsCustomResource(
      this,
      "TriggerInstantiate",
      {
        functionName: "trigger-instantiate",
        role,
        onUpdate: {
          service: "Lambda",
          action: "invoke",
          parameters: {
            FunctionName: instantiate.functionName,
          },
          physicalResourceId: cr.PhysicalResourceId.of(Date.now().toString()),
        },
        policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
          resources: [instantiate.functionArn],
        }),
      }
    );
    customResource.node.addDependency(instantiate);

    //----------APIGATEWAY----------------

    //group Resolvers

    const getGroupsResolver = createResolver(
      "getGroupsResolver",
      "src/groups/getGroups.ts"
    );
    getGroupsResolver.node.addDependency(rdsInstance);

    const getGroupDetailsResolver = createResolver(
      "getGroupDetailsResolver",
      "src/groups/getGroupDetails.ts"
    );
    getGroupDetailsResolver.node.addDependency(rdsInstance);

    const getExpensesFromGroupUserResolver = createResolver(
      "getExpensesFromGroupUser",
      "src/groups/getExpensesFromGroupUser.ts"
    );
    getExpensesFromGroupUserResolver.node.addDependency(rdsInstance);

    const getIncomesFromGroupUserResolver = createResolver(
      "getIncomesFromGroupUser",
      "src/groups/getIncomesFromGroupUser.ts"
    );
    getIncomesFromGroupUserResolver.node.addDependency(rdsInstance);

    const addGroupResolver = createResolver(
      "addGroupResolver",
      "src/groups/addGroup.ts"
    );
    addGroupResolver.node.addDependency(rdsInstance);

    const deleteGroupResolver = createResolver(
      "deleteGroupResolver",
      "src/groups/deleteGroup.ts"
    );
    deleteGroupResolver.node.addDependency(rdsInstance);

    const updateGroupResolver = createResolver(
      "updateGroupResolver",
      "src/groups/updateGroup.ts"
    );
    updateGroupResolver.node.addDependency(rdsInstance);

    const searchGroupOfUserResolver = createResolver(
      "searchGroupOfUserResolver",
      "src/groups/searchGroupOfUser.ts"
    );
    searchGroupOfUserResolver.node.addDependency(rdsInstance);

    //user resolvers

    const getUserInfoResolver = createResolver('getUserInfoResolver', 'src/users/getUserInfo.ts');
    getUserInfoResolver.node.addDependency(rdsInstance);

    const getGroupsFromUserResolver = createResolver('getGroupsFromUserResolver', 'src/users/getGroupsFromUser.ts');
    getGroupsFromUserResolver.node.addDependency(rdsInstance);

    //accounting resolvers

    const getAccountingFromGroupResolver = createResolver('getAccountingFromGroupResolver', 'src/accounting/getAccountingFromGroup.ts');
    getAccountingFromGroupResolver.node.addDependency(rdsInstance);

    const getSettlingDebtsTransactionsResolver = createResolver('getSettlingDebtsTransactionsResolver', 'src/accounting/getSettlingDebtsTransactions.ts');
    getSettlingDebtsTransactionsResolver.node.addDependency(rdsInstance);

    //transaction resolvers

    const getTransactionByIdResolver = createResolver( 'getTransactionByIdResolver', 'src/transactions/getTransactionById.ts');
    getTransactionByIdResolver.node.addDependency(rdsInstance);

    const createTransactionResolver = createResolver( 'createTransactionResolver', 'src/transactions/createTransactions.ts');
    createTransactionResolver.node.addDependency(rdsInstance);

    const deleteTransactionResolver = createResolver( 'deleteTransactionResolver', 'src/transactions/deleteTransaction.ts');
    deleteTransactionResolver.node.addDependency(rdsInstance);

    const updateTransactionResolver = createResolver( 'updateTransactionResolver', 'src/transactions/updateTransaction.ts');
    updateTransactionResolver.node.addDependency(rdsInstance);

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

    //user Integrations

    const getUserInfoIntegration = new apigateway.LambdaIntegration(getUserInfoResolver);
    const getGroupsFromUserIntegration = new apigateway.LambdaIntegration(getGroupsFromUserResolver);

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
      restApiName: props.api.name,
      description: props.api.desc,
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: ["GET", "POST", "PATCH", "DELETE"],
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

    const bodyValidator = createValidator(props.validators.bodyValidator);
    const paramValidator = createValidator(props.validators.paramValidator);
    const bodyAndParamValidator = createValidator(
      props.validators.bodyAndParamValidator
    );

    // API Gateway Model
    const model = new apigateway.Model(this, "Model", {
      modelName: props.api.modelName,
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
    const rootResource = api.root.addResource(props.api.rootResource);

    // Secure Resources and Methods
    const secureResource = rootResource.addResource("secure");
    const paramResource = secureResource.addResource("{param}");

    //group ressources 
    const groupResource =  secureResource.addResource('Groups');
    const groupIdResource = groupResource.addResource('{groupId}');

    const groupSearchResource = groupResource.addResource("search");

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

    //user methods

    userUsernameResource.addMethod('GET', getUserInfoIntegration, {
      requestModels: { 'application/json': model },
      apiKeyRequired: true
    });

    userUsernameGroupsResource.addMethod('GET', getGroupsFromUserIntegration, {
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
      name: props.usageplan.name,
      description: props.usageplan.desc,
      apiStages: [
        {
          api: api,
          stage: api.deploymentStage,
        },
      ],
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
    const apiKey = api.addApiKey("ApiKey", {
      apiKeyName: props.apiKey.name,
      description: props.apiKey.desc,
    });

    usageplan.addApiKey(apiKey);
  }
}
