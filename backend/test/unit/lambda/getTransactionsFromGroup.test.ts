import { handler } from '@groups/getTransactionsFromGroup';
import { instantiateRdsClient } from '@utils/db-connection';
import { createResponse } from '@utils/response-utils';
import { Transaction } from '@models/transaction';
import { APIGatewayProxyResult } from 'aws-lambda';

jest.mock('@utils/db-connection');
jest.mock('@utils/response-utils');

describe('getTransactionsFromGroup handler', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should return transactions for a group successfully', async () => {
    const mockTransactions = [
      new Transaction(),
      new Transaction()
    ];

    mockTransactions[0].id = "1";
    mockTransactions[1].id = "2";

    const mockTransactionRepository = {
      find: jest.fn().mockResolvedValue(mockTransactions)
    };

    (instantiateRdsClient as jest.Mock).mockResolvedValue({
      getRepository: jest.fn().mockReturnValue(mockTransactionRepository),
      destroy: jest.fn()
    });

    (createResponse as jest.Mock).mockReturnValue({
      statusCode: 200,
      body: JSON.stringify(mockTransactions)
    });

    const mockEvent = {
      pathParameters: {
        groupId: '2'
      }
    };

    const mockCallback = jest.fn();

    const result = await handler(mockEvent as any, {} as any, mockCallback) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockTransactions);
  });

  test('should handle errors when fetching transactions', async () => {
    (instantiateRdsClient as jest.Mock).mockRejectedValue(new Error('DB Connection Error'));

    (createResponse as jest.Mock).mockReturnValue({
      statusCode: 500,
      body: 'Cannot fetch transactions.'
    });

    const mockEvent = {
      pathParameters: {
        groupId: '2'
      }
    };

    const mockCallback = jest.fn();

    const result = await handler(mockEvent as any, {} as any, mockCallback) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe('Cannot fetch transactions.');
  });
});

