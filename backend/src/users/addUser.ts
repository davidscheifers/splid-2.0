import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { User } from '../models/user'; 
import { createResponse } from '../utils/response-utils';

export const handler: Handler = async (event: any) => {
  let dataSource;
  //username
  //password
  //mail
  //number

  try {
    console.log('addUser lambda starts here')

    dataSource = await instantiateRdsClient();
    const userRepository = dataSource.getRepository(User);

    const inputUser: User = JSON.parse(event.body); 

    if (inputUser.username === null) {
      return createResponse(400, 'Cannot create user. Missing required fields.');
    }

    // user already exists?

    const user = await userRepository.findOne({
      where: { username: inputUser.username },
    });

    if(user != null){
      return createResponse(400, 'Cannot create user. User already exists.');
    }

    //set transactiosn,accoutings, groups null for new user

    inputUser.transactions = [];
    inputUser.transactions2 = [];
    inputUser.accountings = [];
    inputUser.groups = [];

    await userRepository.save(inputUser);

    return createResponse(200, 'User created successfully.');

  } catch (error) {
    console.error('Error creating user:', error);
    return createResponse(500, 'Cannot create user.');
  }finally{
    if(dataSource){
      await dataSource.destroy();
      console.log('Database connection closed.')
    }
  }
};
