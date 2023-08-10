import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { User } from '../models/user'; 
import { createResponse } from '../utils/response-utils';

export const handler: Handler = async (event: any) => {
  let dataSource;
  //path /users/userid/

  try {
    console.log('getUserInfo lambda starts here')

    dataSource = await instantiateRdsClient();

    const userRepository = dataSource.getRepository(User);

    const username: string = event.pathParameters.username; 

    const user = await userRepository.findOne({
      where: { username: username },
    });
    
    console.log('Successfully retrieved user.');
    console.log(user);

    return createResponse(200,user);

  } catch (error) {
    console.error('Error fetching user details:', error);
    return createResponse(500, 'Cannot get user details.');
  }finally{
    if(dataSource){
      await dataSource.destroy();
      console.log('Database connection closed.')
    }
  }
};
