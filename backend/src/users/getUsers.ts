import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { User } from '../models/user'; // Import your entity

export const handler: Handler = async () => {
  let dataSource;

  try {
    dataSource = await instantiateRdsClient();
    console.log('getting users');
    const userRepository = dataSource.getRepository(User);
    const users = await userRepository.find({ take: 10 });
    console.log(users);

    // Close the connection when you're done
    await dataSource.destroy();

  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  }
};