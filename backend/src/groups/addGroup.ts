import { Handler } from 'aws-lambda';
import { In } from 'typeorm';
import { instantiateRdsClient } from '../utils/db-connection';
import { Group } from '../models/group';
import { User } from '../models/user'; 

export const handler: Handler = async (event: any) => {
  let dataSource;

  try {
    dataSource = await instantiateRdsClient();
    const groupRepository = dataSource.getRepository(Group);
    const userRepository = dataSource.getRepository(User);

    const inputGroup: Group = event.group; 

    if (inputGroup.name === null || inputGroup.createdBy === null) {
      return null;
    }

    const group = new Group();
    group.id = "" // new UUID? oder macht das das TypeORM Automatisch?
    group.name = inputGroup.name;
    group.picturePath = inputGroup.picturePath;
    group.description = inputGroup.description;
    group.createdBy = inputGroup.createdBy;
    group.createdAt = new Date(Date.now());
    group.updatedAt = new Date(Date.now());

    const usernames = new Array<string>();

    if (inputGroup.users == null) {
      usernames.push(inputGroup.createdBy);
    } else {
      usernames.push(...inputGroup.users.map(u => u.username));
      if (!usernames.includes(inputGroup.createdBy)) {
        usernames.push(inputGroup.createdBy);
      }
    }

    group.users = await userRepository.find({
      where: { username: In(usernames) }
    });

    await groupRepository.save(group);

    // Close the connection when you're done
    await dataSource.destroy();

    return group;

  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};
