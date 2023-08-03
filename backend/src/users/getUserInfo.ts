import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { User } from '../models/user'; 

export const handler: Handler = async (event: any) => {
  let dataSource;

  try {
    dataSource = await instantiateRdsClient();
    const userRepository = dataSource.getRepository(User);

    const username: string = event.username; 

    const user = await userRepository.findOne({
      where: { username: username },
    });

    // Close the connection when you're done
    await dataSource.destroy();

    return user;

  } catch (error) {
    console.error('Error fetching group details:', error);
    throw error;
  }
};
