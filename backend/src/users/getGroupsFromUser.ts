import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { User } from '../models/user'; // Import your User entity
import { createResponse } from '../utils/response-utils';

export const handler: Handler = async (event: any) => {
  let dataSource;
  //path  /users/username/groups

  try {
    console.log('getGroupsFromUser lambda starts here')

    dataSource = await instantiateRdsClient();
    const userRepository = dataSource.getRepository(User);

    const username: string = event.pathParameters.username; 

    if (username === null) {
      return createResponse(400, 'Username is required.');
    }

    const user = await userRepository.findOne({
      where: { username: username },
      relations: ["groups"] // Assuming you have set up a relation with groups
    });

    if (user === null) {
      return createResponse(404, 'User not found.');
    }

    const searchResult = user.groups.filter(g => g.name.trim().toLowerCase().trim());

    console.log('Successfully retrieved groups.');

    return createResponse(200, searchResult);

  } catch (error) {
    console.error('Error searching groups:', error);
    return createResponse(500, 'Cannot search groups.');
  }finally{
    if(dataSource){
      await dataSource.destroy();
      console.log('Database connection closed.')
    }
  }
};