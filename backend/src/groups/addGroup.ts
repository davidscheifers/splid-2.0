import { Handler } from 'aws-lambda';
import { In } from 'typeorm';
import { instantiateRdsClient } from '../utils/db-connection';
import { Group } from '../models/group';
import { User } from '../models/user'; 
import { createResponse } from '../utils/response-utils';

export const handler: Handler = async (event: any) => {
  let dataSource;
  //request body: multipart/form-data
  // string($uuid)
  // Name
  // string
  // Description
  // string
  // Users
  // array
  // Picture
  // string($binary)


  try {

    //STILL TODO!
    console.log('addGroup lambda starts here')

    dataSource = await instantiateRdsClient();

    console.log('getting groups and User from db');
    const groupRepository = dataSource.getRepository(Group);
    const userRepository = dataSource.getRepository(User);

    const inputGroup: Group = JSON.parse(event.body);

    if (inputGroup.name === null || inputGroup.createdBy === null) {
      return createResponse(400, 'Cannot create group. Missing required fields.');
    }

    inputGroup.id = "" // new UUID? oder macht das das TypeORM Automatisch?
    inputGroup.createdAt = new Date(Date.now());
    inputGroup.updatedAt = new Date(Date.now());

    const usernames = new Array<string>();

    if (inputGroup.users == null) {
      usernames.push(inputGroup.createdBy);
    } else {
      usernames.push(...inputGroup.users.map(u => u.username));
      if (!usernames.includes(inputGroup.createdBy)) {
        usernames.push(inputGroup.createdBy);
      }
    }

    inputGroup.users = await userRepository.find({
      where: { username: In(usernames) }
    });

    await groupRepository.save(inputGroup);

    // Close the connection when you're done
    await dataSource.destroy();

    return createResponse(200, inputGroup);

  } catch (error) {
    console.error('Error adding group:', error);
    return createResponse(500, 'Cannot add group.') 
  }finally{
    if(dataSource){
      await dataSource.destroy();
      console.log('Database connection closed.')
    }
  }
};
