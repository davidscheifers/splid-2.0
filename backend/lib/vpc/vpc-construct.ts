import * as cdk from "aws-cdk-lib";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import { Construct } from 'constructs';
/**
 * VpcConstruct is a construct that sets up a VPC configuration tailored for RDS and Lambda resolvers.
 * 
 * Features:
 * - Creates a VPC with both public and private isolated subnets.
 * - Sets up security groups for RDS and Lambda resolvers.
 * - Defines ingress rules to allow specific IP addresses and the resolvers to communicate with RDS.
 * - Adds VPC interface endpoints for AWS Lambda and Secrets Manager, enabling resources within the VPC to communicate with these services without traversing the public internet.
 */
export class VpcConstruct extends Construct {
  public readonly vpc: ec2.Vpc;
  public readonly securityGroupResolvers: ec2.SecurityGroup;
  public readonly securityGroupRds: ec2.SecurityGroup;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    // VPC for RDS and Lambda resolvers
    this.vpc = new ec2.Vpc(this, "VPC", {
      vpcName: "rds-vpc",
      maxAzs: 2,
      natGateways: 0,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.PUBLIC, 
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
    this.securityGroupResolvers = new ec2.SecurityGroup(
      this,
      "SecurityGroupResolvers",
      {
        vpc: this.vpc,
        securityGroupName: "resolvers-sg",
        description: "Security Group with Resolvers",
      }
    );

    this.securityGroupRds = new ec2.SecurityGroup(this, "SecurityGroupRds", {
      vpc: this.vpc,
      securityGroupName: "rds-sg",
      description: "Security Group with RDS",
    });

    // IP Address for local testing
    const myIpAddress = "46.223.163.10/32";

    // Ingress and Egress Rules
    this.securityGroupRds.addIngressRule(
      ec2.Peer.ipv4(myIpAddress),
      ec2.Port.tcp(5432),
      "Allow inbound traffic to RDS from local"
    );

    this.securityGroupRds.addIngressRule(
      this.securityGroupResolvers,
      ec2.Port.tcp(5432),
      "Allow inbound traffic to RDS"
    );

    // VPC Interfaces
    this.vpc.addInterfaceEndpoint("LAMBDA", {
      service: ec2.InterfaceVpcEndpointAwsService.LAMBDA,
      subnets: { subnets: this.vpc.isolatedSubnets },
      securityGroups: [this.securityGroupResolvers],
    });

    this.vpc.addInterfaceEndpoint("SECRETS_MANAGER", {
      service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
      subnets: { subnets: this.vpc.isolatedSubnets },
      securityGroups: [this.securityGroupResolvers],
    });
  }
}