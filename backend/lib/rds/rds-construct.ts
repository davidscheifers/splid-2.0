import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from "aws-cdk-lib";
import * as secrets from "aws-cdk-lib/aws-secretsmanager";

/**
 * Properties required to initialize the RdsConstruct.
 * 
 * @property vpc - The VPC where the RDS instance will reside.
 * @property securityGroup - The security group to associate with the RDS instance.
 * @property role - The IAM role that will be granted read permissions to the RDS credentials.
 */
export interface RdsConstructProps {
  vpc: ec2.IVpc;
  securityGroup: ec2.ISecurityGroup;
  role: iam.IRole;
}

/**
 * RdsConstruct creates a PostgreSQL RDS instance with associated credentials.
 * 
 * The construct:
 * - Generates a secret for the RDS credentials.
 * - Initializes a PostgreSQL RDS instance with the provided properties and configurations.
 * - Grants the specified IAM role read access to the RDS credentials.
 */
export class RdsConstruct extends Construct {
  public readonly rdsInstance: rds.DatabaseInstance;
  public readonly credentials: secrets.ISecret;

  constructor(scope: Construct, id: string, props: RdsConstructProps) {
    super(scope, id);

    // Generate a secret for the RDS credentials
    this.credentials = new secrets.Secret(this, 'DbCredentials', {
      generateSecretString: {
        secretStringTemplate: JSON.stringify({ username: 'splidUser' }),
        generateStringKey: 'password',
        excludePunctuation: true,
        passwordLength: 16,
      },
    });
    
    // Create a PostgreSQL RDS instance using the provided properties and specific configurations.
    this.rdsInstance = new rds.DatabaseInstance(this, "PostgresRds", {
      vpc: props.vpc,
      securityGroups: [props.securityGroup],
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      availabilityZone: props.vpc.isolatedSubnets[0].availabilityZone,
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
      credentials: rds.Credentials.fromSecret(this.credentials),
      publiclyAccessible: true,
    });

    // Grant the provided IAM role read access to the RDS credentials.
    this.rdsInstance.secret?.grantRead(props.role);
    this.credentials.grantRead(props.role);
  }
}
