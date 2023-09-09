import { App, Stack } from "aws-cdk-lib";
import { VpcConstruct } from "../../lib/vpc/vpc-construct"; 
import { Template } from "aws-cdk-lib/assertions";

describe('VpcConstruct', () => {
    let stack: Stack;

    beforeEach(() => {
        const app = new App();
        stack = new Stack(app, 'TestStack');
        new VpcConstruct(stack, 'TestVpcConstruct');
    });

    test('creates a VPC with the correct name', () => {
        const template = Template.fromStack(stack);
        template.hasResourceProperties('AWS::EC2::VPC', {
            Tags: [{ Key: 'Name', Value: 'rds-vpc' }]
        });
    });

    test('creates the correct number of subnets', () => {
        const template = Template.fromStack(stack);
        template.resourceCountIs('AWS::EC2::Subnet', 4); 
    });

    test('creates the security group for resolvers with the correct name', () => {
        const template = Template.fromStack(stack);
        template.hasResourceProperties('AWS::EC2::SecurityGroup', {
            GroupName: 'resolvers-sg'
        });
    });

    test('creates the security group for RDS with the correct name', () => {
        const template = Template.fromStack(stack);
        template.hasResourceProperties('AWS::EC2::SecurityGroup', {
            GroupName: 'rds-sg'
        });
    });

    test('creates VPC interface endpoint for Lambda', () => {
        const template = Template.fromStack(stack);
        template.hasResourceProperties('AWS::EC2::VPCEndpoint', {
            ServiceName: {
                "Fn::Join": ["", ["com.amazonaws.", { "Ref": "AWS::Region" }, ".lambda"]]
            }
        });
    });    

    test('creates VPC interface endpoint for Secrets Manager', () => {
        const template = Template.fromStack(stack);
        template.hasResourceProperties('AWS::EC2::VPCEndpoint', {
            ServiceName: {
                "Fn::Join": ["", ["com.amazonaws.", { "Ref": "AWS::Region" }, ".secretsmanager"]]
            }
        });
    });    

    test('RDS security group allows traffic from resolvers security group on port 5432', () => {
        const template = Template.fromStack(stack);
    
        template.hasResource('AWS::EC2::SecurityGroupIngress', {
            Properties: {
                IpProtocol: "tcp",
                FromPort: 5432,
                ToPort: 5432
            }
        });
    });

    test('no NAT gateways are created', () => {
        const template = Template.fromStack(stack);
        template.resourceCountIs('AWS::EC2::NatGateway', 0);
    });
});
