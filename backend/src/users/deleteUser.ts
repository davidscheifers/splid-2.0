import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { User } from '../models/user'; 
import { createResponse } from '../utils/response-utils';

export const handler: Handler = async (event: any) => {
  let dataSource;
  //path  /users/{username}

  try {
    console.log('deleteUser lambda starts here');

    dataSource = await instantiateRdsClient();

    console.log('getting users from db');
    const userRepository = dataSource.getRepository(User);

    const username: string = event.pathParameters.username;

    const user = await userRepository.findOne({
      where: { username: username }
    });

    if ( user === null ) {
      return createResponse(500, 'User not found');
    }

    //TODO: if user has any aktive balance +/- in a group you cannot delete the user  
    // if not make sure to delete all relations

    await userRepository.remove(user);

    return createResponse(200, 'User deleted');

  } catch (error) {
    console.error('Error deleting user:', error);
    return createResponse(500, 'Cannot delete user.');
  } finally {
    if (dataSource) {
      await dataSource.destroy();
      console.log('Database connection closed.')
    }
  }
};
