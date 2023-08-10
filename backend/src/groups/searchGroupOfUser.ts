import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { User } from '../models/user'; 
import { createReadStream } from 'fs';
import { createResponse } from '../utils/response-utils';
import { create } from 'domain';

export const handler: Handler = async (event: any) => {
  let dataSource;
  //query searchTerm=test&username=TestUser

  try {
    console.log('searchGroupOfUsers lambda starts here')

    dataSource = await instantiateRdsClient();

    //in the .net example User.getUsername() is from the jwt we just use the username from the event!

    console.log('getting users from db');
    const userRepository = dataSource.getRepository(User);

    const username: string = event.queryStringParameters?.username; 
    const searchTerm: string = event.queryStringParameters?.searchTerm;


    if (searchTerm === null || username === null) {
      return createResponse(400, 'Missing search term or username.');
    }

    const user = await userRepository.findOne({
      where: { username: username },
      relations: ["groups"]
    });

    if (user === null) {
      return createResponse(404, 'User not found.');
    }

    const searchResult = user.groups.filter(g => g.name.trim().toLowerCase().includes(searchTerm.toLowerCase().trim()));

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
