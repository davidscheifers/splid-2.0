import { App, Stack } from 'aws-cdk-lib';
import { RdsConstruct } from '@rds/rds-construct';
import { Template } from 'aws-cdk-lib/assertions';
import { VpcConstruct } from '@vpc/vpc-construct';
import { IamConstruct } from '@lib/iam/iam-construct';

describe('RdsConstruct', () => {
    let stack: Stack;

    beforeEach(() => {
        const app = new App();
        stack = new Stack(app, 'TestStack');

        const vpcConstruct = new VpcConstruct(stack, 'TestVpcConstruct');
        const iamConstruct = new IamConstruct(stack, 'TestIamConstruct');

        new RdsConstruct(stack, 'TestRdsConstruct', {
            vpc: vpcConstruct.vpc,
            securityGroup: vpcConstruct.securityGroupRds,
            role: iamConstruct.role
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
