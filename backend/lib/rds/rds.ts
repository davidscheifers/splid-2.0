import 'reflect-metadata';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secrets from 'aws-cdk-lib/aws-secretsmanager';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as nodejs from 'aws-cdk-lib/aws-lambda-nodejs';
import * as cr from 'aws-cdk-lib/custom-resources';
import { IApiGatewayStackProps } from '../../bin/stack-config-types';

export class RdsDatabase extends Construct {
  constructor(scope: Construct, id: string, props: IApiGatewayStackProps) {
    super(scope, id);

    // VPC for RDS and Lambda resolvers
    const vpc = new ec2.Vpc(this, 'VPC', {
      vpcName: 'rds-vpc',
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
          cidrMask: 24,
          name: 'rds'
        }
      ]
    })

    // Security Groups
    const securityGroupResolvers = new ec2.SecurityGroup(this, 'SecurityGroupResolvers', {
      vpc,
      securityGroupName: 'resolvers-sg',
      description: 'Security Group with Resolvers',
    })
    const securityGroupRds = new ec2.SecurityGroup(this, 'SecurityGroupRds', {
      vpc,
      securityGroupName: 'rds-sg',
      description: 'Security Group with RDS',
    })

    // Ingress and Egress Rules
    securityGroupRds.addIngressRule(
      securityGroupResolvers,
      ec2.Port.tcp(5432),
      'Allow inbound traffic to RDS'
    )
    
    // VPC Interfaces
    vpc.addInterfaceEndpoint('LAMBDA', {
      service: ec2.InterfaceVpcEndpointAwsService.LAMBDA,
      subnets: { subnets: vpc.isolatedSubnets },
      securityGroups: [securityGroupResolvers],
    })
    vpc.addInterfaceEndpoint('SECRETS_MANAGER', {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      subnets: { subnets: vpc.isolatedSubnets },
      securityGroups: [securityGroupResolvers],
    })    

    // IAM Role
    const role = new iam.Role(this, 'Role', {
      roleName: 'rds-role',
      description: 'Role used in the RDS stack',
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal('ec2.amazonaws.com'),
        new iam.ServicePrincipal('lambda.amazonaws.com'),
      )
    })
    role.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          'cloudwatch:PutMetricData',
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
          'lambda:InvokeFunction',
          'secretsmanager:GetSecretValue',
          'kms:decrypt',
          'rds-db:connect'
        ],
        resources: ['*']
      })
    )

    // RDS PostgreSQL Instance
    const rdsInstance = new rds.DatabaseInstance(this, 'PostgresRds', {
      vpc,
      securityGroups: [securityGroupRds],
      vpcSubnets: { subnets: vpc.isolatedSubnets },
      availabilityZone: vpc.isolatedSubnets[0].availabilityZone,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      engine: rds.DatabaseInstanceEngine.postgres({version: rds.PostgresEngineVersion.VER_14_6}),
      port: 5432,
      instanceIdentifier: 'spliddb-instance',
      allocatedStorage: 10,
      maxAllocatedStorage: 10,
      deleteAutomatedBackups: true,
      backupRetention: cdk.Duration.millis(0),
      credentials: rds.Credentials.fromUsername('splidUser'),
      publiclyAccessible: false
    })
    rdsInstance.secret?.grantRead(role)

    // Secrets for database credentials.
    const credentials = secrets.Secret.fromSecretCompleteArn(this, 'CredentialsSecret', 'arn:aws:secretsmanager:eu-central-1:973206779484:secret:rds-db-creds-test-2RiK43')
    credentials.grantRead(role)

    // Returns function to connect with RDS instance.
    const createResolver = (name:string, entry:string) => new nodejs.NodejsFunction(this, name, {
      functionName: name,
      entry: entry,
      bundling: {
        externalModules: ['pg-native']
      },
      runtime: lambda.Runtime.NODEJS_18_X,
      timeout: cdk.Duration.minutes(2),
      role,
      vpc,
      vpcSubnets: { subnets: vpc.isolatedSubnets },
      securityGroups: [ securityGroupResolvers ],
      environment: {
        RDS_ARN: rdsInstance.secret!.secretArn,
        CREDENTIALS_ARN: credentials.secretArn,
        HOST: rdsInstance.dbInstanceEndpointAddress
      }
    })

    // Instantiate new db with user and permissions
    const instantiate = createResolver('instantiate', 'src/instantiate.ts');
    instantiate.node.addDependency(rdsInstance);

    // Lambda function for gettings groups in the RDS table.
    const getGroups = createResolver('get-groups', 'src/groups/getGroups.ts');
    getGroups.node.addDependency(rdsInstance);

    // // Lambda function for adding groups in the RDS table.
    // const addGroup = createResolver('add-group', 'src/groups/addGroup.ts');
    // addGroup.node.addDependency(rdsInstance);

    // Custom Resource to execute instantiate function.
    const customResource = new cr.AwsCustomResource(this, 'TriggerInstantiate', {
      functionName: 'trigger-instantiate',
      role,
      onUpdate: {
        service: 'Lambda',
        action: 'invoke',
        parameters: {
          FunctionName: instantiate.functionName,
        },
        physicalResourceId: cr.PhysicalResourceId.of(Date.now().toString()),
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: [instantiate.functionArn],
      }),
    });
    customResource.node.addDependency(instantiate)
  }
}
