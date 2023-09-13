import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { User } from '../models/user'; 
import { createResponse } from '../utils/response-utils';

export const handler: Handler = async (event: any) => {
  let dataSource;
  // Path: /users/{username}

  try {
    console.log('deleteUser lambda starts here');

    // Initialize the database connection
    dataSource = await instantiateRdsClient();

    console.log('getting users from db');
    const userRepository = dataSource.getRepository(User);

    // Extract the username from the path parameters
    const username: string = event.pathParameters.username;

    // Find the user by username
    const user = await userRepository.findOne({
      where: { username: username }
    });

    if (user === null) {
      // If the user is not found, return an error response
      return createResponse(500, 'User not found');
    }

    // Remove the user from the database
    await userRepository.remove(user);

    // Return a successful response
    return createResponse(200, 'User deleted');

  } catch (error) {
    // Error handling: Log the error and return an error response
    console.error('Error deleting user:', error);
    return createResponse(500, 'Cannot delete user.');
  } finally {
    // Close the database connection if it was opened
    if (dataSource) {
      await dataSource.destroy();
      console.log('Database connection closed.')
    }
  }
};
