import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { Group } from '../models/group'; 

export const handler: Handler = async (event: any) => {
  let dataSource;

  try {
    dataSource = await instantiateRdsClient();
    const groupRepository = dataSource.getRepository(Group);

    const groupId: string = event.groupId; 

    const group = await groupRepository.findOne({
      where: { id: groupId },
      relations: ["users", "accountings"] 
    });

    // Close the connection when you're done
    await dataSource.destroy();

    return group;

  } catch (error) {
    console.error('Error fetching group details:', error);
    throw error;
  }
};
