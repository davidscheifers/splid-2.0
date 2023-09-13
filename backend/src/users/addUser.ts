import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { User } from '../models/user';
import { createResponse } from '../utils/response-utils';

export const handler: Handler = async (event: any) => {
  let dataSource;

  try {
    // Start of the lambda function, a log message
    console.log('addUser lambda starts here');

    // Initialize the database connection
    dataSource = await instantiateRdsClient();
    const userRepository = dataSource.getRepository(User);

    // Parse the incoming user data from the event payload
    const inputUser: User = JSON.parse(event.body);

    // Check if the mandatory field "username" is missing
    if (!inputUser.username) {
      return createResponse(400, 'Cannot create user. Missing required fields.');
    }

    // Check if the user already exists
    const user = await userRepository.findOne({
      where: { username: inputUser.username },
    });

    if (user != null) {
      // User already exists
      return createResponse(400, 'Cannot create user. User already exists.');
    }

    // Set the fields transactions, transactions2, accountings, and groups to empty arrays for the new user
    inputUser.transactions = [];
    inputUser.transactions2 = [];
    inputUser.accountings = [];
    inputUser.groups = [];

    // Save the new user in the database
    await userRepository.save(inputUser);

    // Return a successful response
    return createResponse(200, 'User created successfully.');

  } catch (error) {
    // Error handling: Error while creating the user
    console.error('Error creating user:', error);

    // Return an error response
    return createResponse(500, 'Cannot create user.');
  } finally {
    // Close the database connection if it was opened
    if (dataSource) {
      await dataSource.destroy();
      console.log('Database connection closed.');
    }
  }
};

