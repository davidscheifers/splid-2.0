import { handler } from '@groups/deleteGroup';
import { instantiateRdsClient } from '@utils/db-connection';
import { createResponse } from '@utils/response-utils';
import { APIGatewayProxyResult } from 'aws-lambda';
import { Group } from '@models/group';
import { User } from '@models/user';

jest.mock('@utils/db-connection');
jest.mock('@utils/response-utils');

describe('deleteGroup handler', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should delete the group successfully', async () => {
    const mockGroup = new Group();
    mockGroup.id = '1';
    mockGroup.users = [
      new User(),
      new User()
    ];

    const mockGroupRepository = {
      findOne: jest.fn().mockResolvedValue(mockGroup),
      save: jest.fn(),
      remove: jest.fn()
    };

    const mockUserRepository = {}; // You can add any needed mock functions here if necessary.

    (instantiateRdsClient as jest.Mock).mockResolvedValue({
      getRepository: jest.fn().mockImplementation((entity) => {
        if (entity === Group) return mockGroupRepository;
        if (entity === User) return mockUserRepository;
        return null;
      }),
      destroy: jest.fn()
    });

    (createResponse as jest.Mock).mockReturnValue({
      statusCode: 200,
      body: 'group deleted'
    });

    const mockEvent = {
      pathParameters: {
        groupId: '1'
      }
    };

    const mockCallback = jest.fn();

    const result = await handler(mockEvent as any, {} as any, mockCallback) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(result.body).toBe('group deleted');
    expect(mockGroupRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' }, relations: ['users'] });
  });

  test('should handle errors when deleting the group', async () => {
    (instantiateRdsClient as jest.Mock).mockRejectedValue(new Error('DB Connection Error'));

    (createResponse as jest.Mock).mockReturnValue({
      statusCode: 500,
      body: 'Cannot delete group.'
    });

    const mockEvent = {
      pathParameters: {
        groupId: '1'
      }
    };

    const mockCallback = jest.fn();

    const result = await handler(mockEvent as any, {} as any, mockCallback) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe('Cannot delete group.');
  });
});
