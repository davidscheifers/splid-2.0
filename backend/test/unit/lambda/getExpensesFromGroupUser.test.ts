import { handler } from '@groups/getExpensesFromGroupUser';
import { instantiateRdsClient } from '@utils/db-connection';
import { createResponse } from '@utils/response-utils';
import { APIGatewayProxyResult } from 'aws-lambda';


jest.mock('@utils/db-connection');
jest.mock('@utils/response-utils');

describe('getExpansesFromGroupUser handler', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should return expenses for a user in a group successfully', async () => {
    const mockTransactions = [
      {
        id: 1,
        amount: -10,
        receiver: { username: 'testUser' },
        group: { id: 1 }
      }
    ];

    const mockRepository = {
      find: jest.fn().mockResolvedValue(mockTransactions)
    };

    (instantiateRdsClient as jest.Mock).mockResolvedValue({
      getRepository: jest.fn().mockReturnValue(mockRepository),
      destroy: jest.fn()
    });

    (createResponse as jest.Mock).mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(mockTransactions)
    });

    const mockEvent = {
      pathParameters: {
        groupId: '2',
        username: 'testUser'
      }
    };

    const mockCallback = jest.fn();

    const result = await handler(mockEvent as any, {} as any, mockCallback) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual([{
      id: 1,
      amount: -10,
      receiver: { username: 'testUser' },
      group: { id: 1 }
    }]);
  });


  test('should handle errors when fetching transactions', async () => {
    (instantiateRdsClient as jest.Mock).mockRejectedValue(new Error('DB Connection Error'));

    (createResponse as jest.Mock).mockReturnValue({
      statusCode: 500,
      body: 'Cannot fetch transactions.'
    });

    const mockEvent = {
      pathParameters: {
        groupId: '1',
        username: 'testUser'
      }
    };

    const mockCallback = jest.fn();

    const result = await handler(mockEvent as any, {} as any, mockCallback) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe('Cannot fetch transactions.');
  });
});