import { Handler } from 'aws-lambda';
import { getRepository } from 'typeorm';
import { instantiateRdsClient } from '../utils/db-connection';
import { User } from '../models/user'; 

export const handler: Handler = async (event: any) => {
  let dataSource;

  try {
    dataSource = await instantiateRdsClient();
    const userRepository = dataSource.getRepository(User);

    const username: string = event.username;

    const user = await userRepository.findOne({
      where: { username: username }
    });

    if ( user === null ) {
      return false;
    }

    await userRepository.remove(user); // Remove the user

    // Close the connection when you're done
    await dataSource.destroy();

    return true;

  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
