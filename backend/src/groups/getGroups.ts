import { APIGatewayProxyHandler, Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { Group } from '../models/group';
import { createResponse } from '../utils/response-utils';

export const handler: APIGatewayProxyHandler = async (event, _context) => {
  let dataSource;

  try {
    console.log('getGroups lambda starts here')

    dataSource = await instantiateRdsClient();

    console.log('getting groups from db');
    const groupRepository = dataSource.getRepository(Group);
    const groups = await groupRepository.find({
      take: 10
    });

    console.log('Successfully retrieved groups.');
    console.log(groups);

    return createResponse(200, groups);

  } catch (error) {
    console.error('Error getting groups:', error);
    return createResponse(500, 'Error getting groups.');
  }finally{
    if(dataSource){
      await dataSource.destroy();
      console.log('Database connection closed.')
    }
  }
};
