import { Handler } from 'aws-lambda';
import { In } from 'typeorm';
import { instantiateRdsClient } from '../utils/db-connection';
import { Group } from '../models/group';
import { User } from '../models/user'; 

export const handler: Handler = async (event: any) => {
  let dataSource;

  try {
    dataSource = await instantiateRdsClient();
    const userRepository = dataSource.getRepository(User);

    const inputUser: User = event.user; // Assuming user is passed as part of the event payload

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
