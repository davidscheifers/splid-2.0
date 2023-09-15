import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { User } from '../models/user'; 
import { createResponse } from '../utils/response-utils';

export const handler: Handler = async (event: any) => {
  let dataSource;
  // Path: /users/{username}/groups

  try {
    console.log('getGroupsFromUser lambda starts here');

    // Initialize the database connection
    dataSource = await instantiateRdsClient();
    const userRepository = dataSource.getRepository(User);

    // Extract the username from the path parameters
    const username: string = event.pathParameters.username; 

    if (username === null) {
      // If username is missing, return a bad request response
      return createResponse(400, 'Username is required.');
    }

    // Find the user by username and include the "groups" relation
    const user = await userRepository.findOne({
      where: { username: username },
      relations: ["groups"] // Assuming you have set up a relation with groups
    });

    if (user === null) {
      // If the user is not found, return a not found response
      return createResponse(404, 'User not found.');
    }

    // Filter and clean the group names (trim and lowercase)
    const searchResult = user.groups.filter(g => g.name.trim().toLowerCase().trim());

    console.log('Successfully retrieved groups.');

    // Return a successful response with the search results
    return createResponse(200, searchResult);

  } catch (error) {
    // Error handling: Log the error and return an error response
    console.error('Error searching groups:', error);
    return createResponse(500, 'Cannot search groups.');
  } finally {
    // Close the database connection if it was opened
    if (dataSource) {
      await dataSource.destroy();
      console.log('Database connection closed.')
    }
  }
};
