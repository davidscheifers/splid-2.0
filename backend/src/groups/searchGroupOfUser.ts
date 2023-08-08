import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { User } from '../models/user'; 

export const handler: Handler = async (event: any) => {
  let dataSource;

  try {
    console.log('searchGroupOfUsers lambda starts here')

    dataSource = await instantiateRdsClient();

    console.log('getting users from db');
    const userRepository = dataSource.getRepository(User);

    const username: string = event.username; 
    const searchTerm: string = event.searchTerm; 

    if (searchTerm === null || username === null) {
      return null;
    }

    const user = await userRepository.findOne({
      where: { username: username },
      relations: ["groups"]
    });

    if (user === null) {
      return null;
    }

    const searchResult = user.groups.filter(g => g.name.trim().toLowerCase().includes(searchTerm.toLowerCase().trim()));

    // Close the connection when you're done
    await dataSource.destroy();

    return searchResult;

  } catch (error) {
    console.error('Error searching groups:', error);
    throw error;
  }
};
