import { IApiGatewayStackProps } from './stack-config-types';

const environmentConfig: IApiGatewayStackProps = {
  tags: {
    Developer: 'Team Splid',
    Application: 'Splid-2.0',
  },
  lambda: {
    name: 'lambda-resolver',
    desc: 'Lambda resolver used for Api Gateway',
    memory: 256,
    timeout: 30,
  },
  api: {
    name: 'splid-rest-api',
    desc: 'Rest Api Gateway used for Api Gateway',
    modelName: 'SplidModel',
    rootResource: 'api',
  },
  usageplan: {
    name: 'splid-usage-plan',
    desc: 'Usage plan used for Api Gateway',
    limit: 500, // per day
    rateLimit: 40,
    burstLimit: 20,
  },
  apiKey: {
    name: 'splid-api-key',
    desc: 'Api Key used for Api Gateway',
  },
  validators: {
    bodyValidator: {
        requestValidatorName: 'splid-body-validator',
        validateRequestBody: true,
        validateRequestParameters: false,
    },
    paramValidator: {
        requestValidatorName: 'splid-param-validator',
        validateRequestBody: false,
        validateRequestParameters: true,
    },
    bodyAndParamValidator: {
        requestValidatorName: 'splid-body-and-param-validator',
        validateRequestBody: true,
        validateRequestParameters: true,
    },
  }
};

export default environmentConfig;