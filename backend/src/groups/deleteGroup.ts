import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { Group } from '../models/group';
import { User } from '../models/user'; 
import { createResponse } from '../utils/response-utils';

export const handler: Handler = async (event: any) => {
  let dataSource;

  try {
    console.log('deleteGroup lambda starts here')

    dataSource = await instantiateRdsClient();

    console.log('getting groups and user from db');
    const groupRepository = dataSource.getRepository(Group);
    const userRepository = dataSource.getRepository(User);

    const groupId: string = event.pathParameters.groupId; 
    const deleteGroup: Group = JSON.parse(event.body);

    const group = await groupRepository.findOne({
      where: { id: groupId },
      relations: ["users"] 
    });

    const user = await userRepository.findOne({
      where: { username: deleteGroup.createdBy }
    });

    if (group === null || user === null || group.createdBy !== user.username) {
      return createResponse(500, 'Cannot delete group.');
    }

    // Clearing users if you have a relation that needs to be cleared
    group.users = [];

    await groupRepository.save(group); 
    await groupRepository.remove(group); 

    return true;

  } catch (error) {
    console.error('Error deleting group:', error);
    return createResponse(500, 'Cannot delete group.')
  }finally{
    if(dataSource){
      await dataSource.destroy();
      console.log('Database connection closed.')
    }
  }
};
