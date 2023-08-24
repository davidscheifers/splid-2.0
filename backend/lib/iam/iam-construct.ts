import { Construct } from 'constructs';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secrets from 'aws-cdk-lib/aws-secretsmanager';

export interface IamConstructProps {
  rdsInstance: rds.DatabaseInstance;
  credentialsSecret: secrets.ISecret;
}

export class IamConstruct extends Construct {
  public readonly role: iam.Role;

  constructor(scope: Construct, id: string, props: IamConstructProps) {
    super(scope, id);

    this.role = new iam.Role(this, "Role", {
      roleName: "rds-role",
      description: "Role used in the RDS construct",
      assumedBy: new iam.CompositePrincipal(
        new iam.ServicePrincipal("ec2.amazonaws.com"),
        new iam.ServicePrincipal("lambda.amazonaws.com")
      ),
    });

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

    props.rdsInstance.secret?.grantRead(this.role);
    props.credentialsSecret.grantRead(this.role);
  }
}
