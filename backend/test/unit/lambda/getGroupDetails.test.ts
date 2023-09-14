import { handler } from '@groups/getGroupDetails';
import { instantiateRdsClient } from '@utils/db-connection';
import { createResponse } from '@utils/response-utils';
import { APIGatewayProxyResult } from 'aws-lambda';

jest.mock('@utils/db-connection');
jest.mock('@utils/response-utils');

describe('getGroupDetails handler', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should return group details successfully', async () => {
    const mockGroup = {
      id: 1,
      name: 'Test Group',
      users: [],
      accountings: []
    };

    const mockRepository = {
      findOne: jest.fn().mockResolvedValue(mockGroup)
    };

    (instantiateRdsClient as jest.Mock).mockResolvedValue({
      getRepository: jest.fn().mockReturnValue(mockRepository),
      destroy: jest.fn()
    });

    (createResponse as jest.Mock).mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(mockGroup)
    });

    const mockEvent = {
      pathParameters: {
        groupId: '2'
      }
    };
    
    const mockCallback = jest.fn();

    const result = await handler(mockEvent as any, {} as any, mockCallback) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({
      id: 1,
      name: 'Test Group',
      users: [],
      accountings: []
    });
  });

  test('should handle errors when getting group details', async () => {
    (instantiateRdsClient as jest.Mock).mockRejectedValue(new Error('DB Connection Error'));

    (createResponse as jest.Mock).mockReturnValue({
      statusCode: 500,
      body: 'Cannot get group.'
    });

    const mockEvent = {
      pathParameters: {
        groupId: '1'
      }
    };

    const mockCallback = jest.fn();

    const result = await handler(mockEvent as any, {} as any, mockCallback) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe('Cannot get group.');
  });

});
