import { handler } from '../../../src/groups/getGroupDetails';
import { instantiateRdsClient } from '../../../src/utils/db-connection';
import { createResponse } from '../../../src/utils/response-utils';
import { APIGatewayProxyResult } from 'aws-lambda';

jest.mock('../../../src/utils/db-connection');
jest.mock('../../../src/utils/response-utils');

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
    
    expect(mockRepository.findOne).toHaveBeenCalledWith({ id: 2 });

    const mockCallback = jest.fn();

    const result = await handler(mockEvent as any, {} as any, mockCallback) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockGroup);
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
