import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secrets from 'aws-cdk-lib/aws-secretsmanager';

/**
 * Properties required to initialize the IamConstruct.
 * 
 * @property rdsInstance - The RDS instance associated with the IAM role.
 * @property credentialsSecret - The secret containing RDS credentials.
 */
export interface IamConstructProps {
  rdsInstance: rds.DatabaseInstance;
  credentialsSecret: secrets.ISecret;
}

/**
 * IamConstruct creates an IAM role with permissions tailored for RDS and related services.
 * 
 * The construct:
 * - Initializes an IAM role that can be assumed by both EC2 and Lambda services.
 * - Attaches a policy to the role granting permissions for various AWS services, including RDS, CloudWatch, EC2, Lambda, Secrets Manager, and KMS.
 */
export class IamConstruct extends Construct {
  public readonly role: iam.Role;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Create an IAM role that can be assumed by both EC2 and Lambda services.
    this.role = new iam.Role(this, "Role", {
      roleName: "rds-role",
      description: "Role used in the RDS construct",
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal("ec2.amazonaws.com"),
        new iam.ServicePrincipal("lambda.amazonaws.com")
      ),
    });

    // Attach a policy to the role granting permissions for various AWS services.
    this.role.addToPolicy(
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
  }
}
