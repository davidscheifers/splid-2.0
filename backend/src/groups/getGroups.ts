import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { Group } from '../models/group'; // Import your entity

export const handler: Handler = async () => {
  let dataSource;

  try {
    dataSource = await instantiateRdsClient();
    console.log('getting groups');
    const groupRepository = dataSource.getRepository(Group);
    const groups = await groupRepository.find({ take: 10 });
    console.log(groups);

    // Close the connection when you're done
    await dataSource.destroy();

  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  }
};