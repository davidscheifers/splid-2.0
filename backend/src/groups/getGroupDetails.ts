import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { Group } from '../models/group'; 
import { createResponse } from '../utils/response-utils';

export const handler: Handler = async (event: any) => {
  let dataSource;

  try {
    console.log('getGroupDetails lambda starts here')
    
    dataSource = await instantiateRdsClient();

    console.log('getting groups from db');
    const groupRepository = dataSource.getRepository(Group);
    const groupId: string = event.pathParameters.groupId; 

    const group = await groupRepository.findOne({
      where: { id: groupId },
      relations: ["users", "accountings"] //dont know if i need this. test!
    });

    console.log('Successfully retrieved group.');
    console.log(group);

    return createResponse(200,group);

  } catch (error) {
    console.error('Error getting group:', error);
    return createResponse(500, 'Cannot get group.');
  }finally{
    if(dataSource){
      await dataSource.destroy();
      console.log('Database connection closed.')
    }
  }
};
