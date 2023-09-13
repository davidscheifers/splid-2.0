import { SecretsManager } from 'aws-sdk';
import { DataSource } from 'typeorm';
import { instantiateRdsClient } from '../../../src/utils/db-connection';
import { Group } from '../../../src/models/group';
import { Accounting } from '../../../src/models/accounting';
import { Transaction } from '../../../src/models/transaction';
import { User } from '../../../src/models/user';

const mockSecretData = {
  ARN: 'x',
  Name: 'test_creds',
  VersionId: 'x',
  SecretString: '{"username":"test","password":"password", "host":"test"}',
  VersionStages: ['x'],
  CreatedDate: 'x'
};

jest.mock('typeorm', () => {
  const actualTypeOrm = jest.requireActual('typeorm');

  return {
    ...actualTypeOrm,
    DataSource: jest.fn().mockImplementation(() => {
      return {
        initialize: jest.fn().mockResolvedValue(true)
      };
    }),
  };
});


// Mock SecretsManager
jest.mock('aws-sdk', () => {
  return {
    SecretsManager: function () {
      return {
        getSecretValue: function ({ SecretId }: { SecretId?: string }) {
          if (!SecretId) {
            throw new Error('No secret name provided');
          }
          if (SecretId === 'test_creds') {
            return {
              promise: function () {
                return mockSecretData;
              }
            };
          } else {
            throw new Error('mock error');
          }
        }
      };
    }
  };
});

describe('instantiateRdsClient', () => {
  let originalRDSArn: string | undefined;

  beforeAll(() => {
    originalRDSArn = process.env.RDS_ARN;
  });

  beforeEach(() => {
    (DataSource as jest.MockedClass<typeof DataSource>).mockClear();
  });

  afterAll(() => {
    process.env.RDS_ARN = originalRDSArn;
  });

  test('Then the correct data is returned.', async () => {
    const mockReturnValue = {
      username: 'test',
      password: 'password',
      host: 'test'
    };
    const secretManager = new SecretsManager();
    const resultData = await secretManager.getSecretValue({ SecretId: 'test_creds' }).promise();
    const result = JSON.parse(resultData.SecretString as string);
    expect(result).toEqual(mockReturnValue);
  });

  test('should instantiate DataSource with correct parameters', async () => {
    process.env.RDS_ARN = 'test_creds';
    await instantiateRdsClient();

    expect(DataSource).toHaveBeenCalledWith({
      type: 'postgres',
      host: 'test',
      port: 5432,
      username: 'test',
      password: 'password',
      database: 'postgres',
      schema: 'splid',
      entities: [Group, Accounting, Transaction, User],
      synchronize: false,
    });
  });


});
