import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { User } from '../models/user'; 
import { createResponse } from '../utils/response-utils';

export const handler: Handler = async (event: any) => {
  let dataSource;
  // Path: /users/{username}/

  try {
    console.log('getUserInfo lambda starts here');

    // Initialize the database connection
    dataSource = await instantiateRdsClient();

    const userRepository = dataSource.getRepository(User);

    // Extract the username from the path parameters
    const username: string = event.pathParameters.username; 

    // Find the user by username
    const user = await userRepository.findOne({
      where: { username: username },
    });

    console.log('Successfully retrieved user.');
    console.log(user);

    // Set the password to null (if the user exists)
    if (user !== null) {
      user.password = "";
    } else {
      // If the user is not found, return a not found response
      return createResponse(404, 'User not found.');
    }

    // Return a successful response with the user data (with password set to null)
    return createResponse(200, user);

  } catch (error) {
    // Error handling: Log the error and return an error response
    console.error('Error fetching user details:', error);
    return createResponse(500, 'Cannot get user details.');
  } finally {
    // Close the database connection if it was opened
    if (dataSource) {
      await dataSource.destroy();
      console.log('Database connection closed.');
    }
  }
};
