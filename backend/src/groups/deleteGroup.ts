import { Handler } from 'aws-lambda';
import { getRepository } from 'typeorm';
import { instantiateRdsClient } from '../utils/db-connection';
import { Group } from '../models/group';
import { User } from '../models/user'; 

export const handler: Handler = async (event: any) => {
  let dataSource;

  try {
    dataSource = await instantiateRdsClient();
    const groupRepository = dataSource.getRepository(Group);
    const userRepository = dataSource.getRepository(User);

    const groupId: string = event.groupId; 
    const username: string = event.username;

    const group = await groupRepository.findOne({
      where: { id: groupId },
      relations: ["users"] // Assuming you have set up a relation with users
    });

    const user = await userRepository.findOne({
      where: { username: username }
    });

    if (group === null || user === null || group.createdBy !== user.username) {
      return false;
    }

    // There is no property users in the Group entity yet!
    // Clearing users if you have a relation that needs to be cleared
    //group.users = [];

    await groupRepository.save(group); // Update the group to clear the users
    await groupRepository.remove(group); // Remove the group

    // Close the connection when you're done
    await dataSource.destroy();

    return true;

  } catch (error) {
    console.error('Error deleting group:', error);
    throw error;
  }
};
