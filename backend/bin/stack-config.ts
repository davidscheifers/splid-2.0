import { IApiGatewayStackProps } from './stack-config-types';

const environmentConfig: IApiGatewayStackProps = {
  tags: {
    Developer: 'Team Splid',
    Application: 'Splid-2.0',
  },
  lambda: {
    name: 'demo-resolver',
    desc: 'Lambda resolver used for Api Gateway YouTube tutorial',
    memory: 256,
    timeout: 30,
  },
  api: {
    name: 'demo-rest-api',
    desc: 'Rest Api Gateway used for Api Gateway YouTube tutorial',
    modelName: 'DemoModel',
    rootResource: 'api',
  },
  usageplan: {
    name: 'demo-usage-plan',
    desc: 'Usage plan used for Api Gateway YouTube tutorial',
    limit: 500, // per day
    rateLimit: 40,
    burstLimit: 20,
  },
  apiKey: {
    name: 'demo-api-key',
    desc: 'Api Key used for Api Gateway YouTube tutorial',
  },
  validators: {
    bodyValidator: {
        requestValidatorName: 'demo-body-validator',
        validateRequestBody: true,
        validateRequestParameters: false,
    },
    paramValidator: {
        requestValidatorName: 'demo-param-validator',
        validateRequestBody: false,
        validateRequestParameters: true,
    },
    bodyAndParamValidator: {
        requestValidatorName: 'demo-body-and-param-validator',
        validateRequestBody: true,
        validateRequestParameters: true,
    },
  }
};

export default environmentConfig;