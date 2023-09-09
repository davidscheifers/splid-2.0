import { App, Stack } from 'aws-cdk-lib';
import { RdsConstruct } from '../../lib/rds/rds-construct';
import { Template } from 'aws-cdk-lib/assertions';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

jest.mock('aws-cdk-lib/aws-ec2', () => {
    return {
        ...jest.requireActual('aws-cdk-lib/aws-ec2'),
        Vpc: jest.fn().mockImplementation(() => {
            return {
                isolatedSubnets: [{
                    availabilityZone: 'us-west-2a',
                    vpcId: 'vpc-12345678',
                    cidrBlock: '10.0.0.0/24',
                    subnetId: 'subnet-12345678',
                }],
                publicSubnets: [{
                    availabilityZone: 'us-west-2a',
                    vpcId: 'vpc-12345678',
                    cidrBlock: '10.0.1.0/24',
                    subnetId: 'subnet-87654321',
                }],
                selectSubnets: jest.fn().mockReturnValue({
                    availabilityZones: ['us-west-2a'],
                    vpcId: 'vpc-12345678',
                    subnetIds: ['subnet-87654321'], // This is the key property
                })
            };
        }),
    };
});


describe('RdsConstruct', () => {
    let stack: Stack;

    beforeEach(() => {
        const app = new App();
        stack = new Stack(app, 'TestStack');

        const vpc = new ec2.Vpc(stack, 'TestVpc');
        const securityGroup = new ec2.SecurityGroup(stack, 'TestSG', { vpc });
        const role = new iam.Role(stack, 'TestRole', {
            assumedBy: new iam.ServicePrincipal('rds.amazonaws.com')
        });

        new RdsConstruct(stack, 'TestRdsConstruct', {
            vpc,
            securityGroup,
            role
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });


    test('creates an RDS instance', () => {
        const template = Template.fromStack(stack);
        template.resourceCountIs('AWS::RDS::DBInstance', 1);
        template.hasResourceProperties('AWS::RDS::DBInstance', {
            DBInstanceIdentifier: 'spliddb-instance',
            Engine: 'postgres',
            Port: "5432",
        });
    });

    test('creates an RDS secret', () => {
        const template = Template.fromStack(stack);
        template.resourceCountIs('AWS::SecretsManager::Secret', 1);
    });

    test('grants read access to the IAM role for the RDS secret', () => {
        const template = Template.fromStack(stack);
        
        // Ensure there's an AWS::IAM::Policy resource in the template
        template.resourceCountIs('AWS::IAM::Policy', 1);
    
        const policyResource = Object.values(template.findResources('AWS::IAM::Policy'))[0];
        const statements = policyResource.Properties.PolicyDocument.Statement;
        
        // Validate the permissions in the statements
        expect(statements).toEqual(expect.arrayContaining([
            expect.objectContaining({
                Action: expect.arrayContaining([
                    'secretsmanager:GetSecretValue',
                    'secretsmanager:DescribeSecret'
                ]),
                Effect: 'Allow',
            })
        ]));
    });

});
