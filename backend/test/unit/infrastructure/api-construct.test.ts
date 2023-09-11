import { Template } from "aws-cdk-lib/assertions";
import * as cdk from "aws-cdk-lib";
import { ApiConstruct } from "../../../lib/api/api-construct";
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
import { RdsConstruct } from "../../../lib/rds/rds-construct";
import environmentConfig from '../../../bin/stack-config';
import { VpcConstruct } from "../../../lib/vpc/vpc-construct";
import { IamConstruct } from "../../../lib/iam/iam-construct";

describe("ApiConstruct", () => {
    let stack: cdk.Stack;

    beforeEach(() => {
        const app = new cdk.App();
        stack = new cdk.Stack(app, "ApiTestStack");

        const vpcConstruct = new VpcConstruct(stack, 'TestVpcConstruct');
        const iamConstruct = new IamConstruct(stack, 'TestIamConstruct');

        const rds = new RdsConstruct(stack, 'TestRdsConstruct', {
            vpc: vpcConstruct.vpc,
            securityGroup: vpcConstruct.securityGroupRds,
            role: iamConstruct.role
        });
        
        new ApiConstruct(stack, 'TestApiConstruct',{
            vpc: vpcConstruct.vpc,
            securityGroup: vpcConstruct.securityGroupRds,
            role: iamConstruct.role,
            rdsInstance: rds.rdsInstance,
            config: environmentConfig,
            credentials: rds.credentials
        });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should create an API Gateway", () => {
        const template = Template.fromStack(stack);

        template.resourceCountIs('AWS::ApiGateway::RestApi', 1);
    });

    // some more tests here...

});
