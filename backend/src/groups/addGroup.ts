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

    const inputGroup: Group = event.group; // Assuming group is passed as part of the event payload

    if (inputGroup.name === null || inputGroup.created_by === null) {
      return null;
    }

    const group = new Group();
    group.id = "" // new UUID? oder macht das das TypeORM Automatisch?
    group.name = inputGroup.name;
    group.picture_path = inputGroup.picture_path;
    group.description = inputGroup.description;
    group.created_by = inputGroup.created_by;
    group.created_at = new Date(Date.now());
    group.updated_at = new Date(Date.now());

    const usernames = new Array<string>();

    // There is no property users in the Group entity!

    // if (inputGroup.users == null) {
    //   usernames.push(inputGroup.created_by);
    // } else {
    //   usernames.push(...inputGroup.users.map(u => u.username));
    //   if (!usernames.includes(inputGroup.created_by)) {
    //     usernames.push(inputGroup.created_by);
    //   }
    // }

    // group.users = await userRepository.find({
    //   where: { username: In(usernames) }
    // });

    await groupRepository.save(group);

    // Close the connection when you're done
    await dataSource.destroy();

    return group;

  } catch (error) {
    console.error('Error creating group:', error);
    throw error;
  }
};
