import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { Group } from '../models/group'; 

export const handler: Handler = async (event: any) => {
  let dataSource;

  try {
    dataSource = await instantiateRdsClient();
    const groupRepository = dataSource.getRepository(Group);

    const group: Group = event.group; 

    if (group.Users === null) {
      return false;
    }

    const createdBy = await GetCreatedBy(group.id);

    if (createdBy === null) {
      return false;
    }

    group.updatedAt = new Date(); 
    group.createdBy = createdBy;

    const users = group.Users;

    group.Users = undefined;

    if (!await UpdateUsers(users, group)) { // You must define this function
      return false;
    }

    await groupRepository.save(group); 

    // Close the connection when you're done
    await dataSource.destroy();

    return true;

  } catch (error) {
    console.error('Error updating group:', error);
    throw error;
  }
};

async function GetCreatedBy(id: string): Promise<string | null> {
  let dataSource;

  try {
    dataSource = await instantiateRdsClient(); 
    const groupRepository = dataSource.getRepository(Group);

    const group = await groupRepository.findOne({where: { id: id }},);

    if (group === null) {
      return null;
    }

    // Close the connection when you're done
    await dataSource.close();

    return group.createdBy; 

  } catch (error) {
    console.error('Error getting createdBy:', error);
    throw error;
  }
}

export { GetCreatedBy };

//---------------

import { User } from '../models/user'; // Import your User entity
import { Accounting } from '../models/accounting'; // Import your Accounting entity

async function UpdateUsers(users: User[] | undefined, group: Group): Promise<boolean> {
    if (!users) {
      return false; // You can handle the undefined users case here as needed
    }
  
    let dataSource;
    let updateList: User[] = [];
  
    try {
      dataSource = await instantiateRdsClient();
      const groupRepository = dataSource.getRepository(Group);
      const userRepository = dataSource.getRepository(User);
      const accountingRepository = dataSource.getRepository(Accounting);
  
      const groupOld = await groupRepository.findOne({ where: { id: group.id }, relations: ['users'] });
  
      if (!groupOld || !groupOld.Users) {
        return false;
      }
  
      const userToAdd = groupOld.Users ? users.filter(user => !groupOld.Users!.includes(user)) : [];
  
      if (userToAdd.length > 0) {
        const newUsers = await CreateChangeListForUsersUpdate(userToAdd, group);
        
        if (newUsers === null) {
          return false;
        }
        
        updateList = updateList.concat(newUsers);
      }
  
      const userToDelete = groupOld.Users.filter(user => !users.includes(user));
  
      if (userToDelete.length > 0) {
        let checkBalanceSucc = true;
  
        const tasks = userToDelete.map(async user => {
          const succ = await CheckBalance(user, group);
          if (succ) {
            const accounting = await accountingRepository.findOne({ where: { groupId: group.id, username: user.username } });
            if (accounting) {
              await accountingRepository.remove(accounting);
            }
  
            const dbUser = await userRepository.findOne({ where: { username: user.username }, relations: ['groups'] });
            if (dbUser) {
              dbUser.groups = dbUser.groups.filter(g => g.id !== group.id);
              updateList.push(dbUser);
            }
          } else {
            checkBalanceSucc = false;
          }
        });
  
        await Promise.all(tasks);
  
        if (!checkBalanceSucc) {
          return false;
        }
      }
  
      if (updateList.length > 0) {
        await userRepository.save(updateList);
      }
  
      await dataSource.destroy();
  
      return true;
    } catch (error) {
      console.error('Error updating users:', error);
      throw error;
    }
  }
  
  export { UpdateUsers };
  
//---------------

async function CreateChangeListForUsersUpdate(users: User[], group: Group): Promise<User[] | null> {
    const updateList: User[] = [];
    let dataSource;
  
    try {
      dataSource = await instantiateRdsClient();
      const userRepository = dataSource.getRepository(User);
  
      if (users.length > 0) {
        for (const user of users) {
          const dbUser = await userRepository.findOne({ where: { username: user.username } });
  
          if (dbUser) {
            dbUser.groups.push(group); // Assuming groups is an array in the User entity
            updateList.push(dbUser);
          } else {
            return null;
          }
        }
      }
  
      return updateList;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }
  
  export { CreateChangeListForUsersUpdate };
  
//---------------


async function CheckBalance(user: User, group: Group): Promise<boolean> {
    let dataSource;
  try {
    dataSource = await instantiateRdsClient();
    const accountingRepository = dataSource.getRepository(Accounting);

    const accounting = await accountingRepository.findOne({
      where: { groupId: group.id, username: user.username }
    });

    if (accounting === null) {
      return true;
    }

    if (Math.abs(accounting.balance) < 0.009) {
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error checking balance:', error);
    throw error;
  }
}

export { CheckBalance };
