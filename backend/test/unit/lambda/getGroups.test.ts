import { handler } from '@groups/getGroups';
import { instantiateRdsClient } from '@utils/db-connection';
import { createResponse } from '@utils/response-utils';
import { APIGatewayProxyResult } from 'aws-lambda';

jest.mock('@utils/db-connection');
jest.mock('@utils/response-utils');

describe('getGroups handler', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should return groups successfully', async () => {
    const mockGroups = [{ id: 1, name: 'Test Group' }];

    const mockRepository = {
      find: jest.fn().mockResolvedValue(mockGroups)
    };

    (instantiateRdsClient as jest.Mock).mockResolvedValue({
      getRepository: jest.fn().mockReturnValue(mockRepository),
      destroy: jest.fn()
    });

    (createResponse as jest.Mock).mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(mockGroups)
    });

    const mockCallback = jest.fn();

    const result = await handler({} as any, {} as any, mockCallback) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual([{ id: 1, name: "Test Group" }]);
    
  });

  test('should handle errors when getting groups', async () => {
    (instantiateRdsClient as jest.Mock).mockRejectedValue(new Error('DB Connection Error'));

    (createResponse as jest.Mock).mockReturnValue({
      statusCode: 500,
      body: 'Error getting groups.'
    });

    const mockCallback = jest.fn();

    const result = await handler({} as any, {} as any, mockCallback) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe('Error getting groups.');
});


});
