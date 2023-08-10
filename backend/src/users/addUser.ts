import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { User } from '../models/user'; 

export const handler: Handler = async (event: any) => {
  let dataSource;
  ////path //groupid/details

  try {
    dataSource = await instantiateRdsClient();
    const userRepository = dataSource.getRepository(User);

    const inputUser: User = event.user; 

    if (inputUser.username === null) {
      return null;
    }

    const user = new User();
    user.username = inputUser.username;
    user.password = inputUser.password;
    user.mail = inputUser.mail;
    user.number = inputUser.number;

    const usernames = new Array<string>();

    await userRepository.save(user);

    // Close the connection when you're done
    await dataSource.destroy();

    return user;

  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
