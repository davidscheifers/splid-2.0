import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { User } from '../models/user'; // Import your User entity

export const handler: Handler = async (event: any) => {
  let dataSource;

  try {
    dataSource = await instantiateRdsClient();
    const userRepository = dataSource.getRepository(User);

    const username: string = event.username; // Assuming username is passed as part of the event payload

    if (username === null) {
      return null;
    }

    const user = await userRepository.findOne({
      where: { username: username },
      relations: ["groups"] // Assuming you have set up a relation with groups
    });

    if (user === null) {
      return null;
    }

    // same Problem with entity 
    //const searchResult = user.groups.filter(g => g.name.trim().toLowerCase().trim());
    const searchResult = null;

    // Close the connection when you're done
    await dataSource.destroy();

    return searchResult;

  } catch (error) {
    console.error('Error searching groups:', error);
    throw error;
  }
};