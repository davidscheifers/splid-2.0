import { handler } from '@groups/addGroup';
import { instantiateRdsClient } from '@utils/db-connection';
import { createResponse } from '@utils/response-utils';
import { APIGatewayProxyResult } from 'aws-lambda';
import { Group } from '@models/group';
import { User } from '@models/user';

jest.mock('@utils/db-connection');
jest.mock('@utils/response-utils');

describe('addGroup handler', () => {

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should add the group successfully', async () => {
    const mockGroup = new Group();
    mockGroup.name = 'Test Group';
    mockGroup.createdBy = 'testUser';
    mockGroup.users = [new User()];

    const mockGroupRepository = {
      save: jest.fn()
    };

    const mockUserRepository = {
      find: jest.fn().mockResolvedValue([new User()])
    };

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
      body: JSON.stringify(mockGroup)
    });

    const mockEvent = {
      body: JSON.stringify({
        name: 'Test Group',
        createdBy: 'testUser'
      })
    };

    const mockCallback = jest.fn();

    const result = await handler(mockEvent as any, {} as any, mockCallback) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual(mockGroup);
  });

  test('should handle errors when adding the group', async () => {
    (instantiateRdsClient as jest.Mock).mockRejectedValue(new Error('DB Connection Error'));

    (createResponse as jest.Mock).mockReturnValue({
      statusCode: 500,
      body: 'Cannot add group.'
    });

    const mockEvent = {
      body: JSON.stringify({
        name: 'Test Group',
        createdBy: 'testUser'
      })
    };

    const mockCallback = jest.fn();

    const result = await handler(mockEvent as any, {} as any, mockCallback) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(500);
    expect(result.body).toBe('Cannot add group.');
  });

  test('should handle missing required fields', async () => {
    (createResponse as jest.Mock).mockReturnValue({
      statusCode: 400,
      body: 'Cannot create group. Missing required fields.'
    });

    const mockEvent = {
      body: JSON.stringify({
        name: 'Test Group'
      })
    };

    const mockCallback = jest.fn();

    const result = await handler(mockEvent as any, {} as any, mockCallback) as APIGatewayProxyResult;

    expect(result.statusCode).toBe(400);
    expect(result.body).toBe('Cannot create group. Missing required fields.');
  });
});
