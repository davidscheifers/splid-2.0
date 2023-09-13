import { Handler } from "aws-lambda";
import { instantiateRdsClient } from "../utils/db-connection";
import { Group } from "../models/group";
import { User } from "../models/user";
import { Accounting } from "../models/accounting";
import { createResponse } from "../utils/response-utils";

// Define the Lambda handler function
export const handler: Handler = async (event: any) => {
  let dataSource;

  try {
    // Lambda function starts
    console.log("updateGroup lambda starts here");

    // Establishes the database connection
    dataSource = await instantiateRdsClient();

    const groupRepository = dataSource.getRepository(Group);

    // The JSON request body is parsed into a Group object
    const inputGroup: Group = JSON.parse(event.body);

    // Validation for missing fields
    if (inputGroup.users === null) {
      return createResponse(
        400,
        "Cannot update group. Missing required fields."
      );
    }

    // Get the creator of the group from the database
    const createdBy = await GetCreatedBy(inputGroup.id);

    if (createdBy === null) {
      return createResponse(400, "Cannot update group. Group not found.");
    }

    inputGroup.updatedAt = new Date();
    inputGroup.createdBy = createdBy;

    const users = inputGroup.users;

    // Perform user update, including balance check
    if (!(await UpdateUsers(users, inputGroup))) {
      return createResponse(400, "Cannot update group. Error updating users.");
    }

    // Save group data
    await groupRepository.save(inputGroup);

    return createResponse(200, "Group updated successfully.");
  } catch (error) {
    // Error handling
    console.error("Error updating group:", error);
    return createResponse(500, "Error updating group.");
  } finally {
    // Closes the database connection if available
    if (dataSource) {
      await dataSource.destroy();
      console.log("Database connection closed.");
    }
  }
};

async function GetCreatedBy(id: string): Promise<string | null> {
  let dataSource;

  try {
    dataSource = await instantiateRdsClient();
    const groupRepository = dataSource.getRepository(Group);

    const group = await groupRepository.findOne({ where: { id: id } });

    if (group === null) {
      return null;
    }

    return group.createdBy;
  } catch (error) {
    console.error("Error getting createdBy:", error);
    return null;
  } finally {
    if (dataSource) {
      await dataSource.destroy();
      console.log("Database connection closed.");
    }
  }
}

export { GetCreatedBy };

//---------------

import { User } from "../models/user";
import { Accounting } from "../models/accounting";

async function UpdateUsers(users: User[], group: Group): Promise<boolean> {
  if (!users) {
    return false;
  }

  let dataSource;
  let updateList: User[] = [];

  try {
    dataSource = await instantiateRdsClient();
    const groupRepository = dataSource.getRepository(Group);
    const userRepository = dataSource.getRepository(User);
    const accountingRepository = dataSource.getRepository(Accounting);

    const groupOld = await groupRepository.findOne({
      where: { id: group.id },
      relations: ["users"],
    });

    if (!groupOld || !groupOld.users) {
      return false;
    }

    const userToAdd = groupOld.users
      ? users.filter((user) => !groupOld.users!.includes(user))
      : [];

    if (userToAdd.length > 0) {
      const newUsers = await CreateChangeListForUsersUpdate(userToAdd, group);

      if (newUsers === null) {
        return false;
      }

      updateList = updateList.concat(newUsers);
    }

    const userToDelete = groupOld.users.filter((user) => !users.includes(user));

    if (userToDelete.length > 0) {
      let checkBalanceSucc = true;

      const tasks = userToDelete.map(async (user) => {
        const succ = await CheckBalance(user, group);
        if (succ) {
          const accounting = await accountingRepository.findOne({
            where: { groupId: group.id, username: user.username },
          });
          if (accounting) {
            await accountingRepository.remove(accounting);
          }

          const dbUser = await userRepository.findOne({
            where: { username: user.username },
            relations: ["groups"],
          });
          if (dbUser) {
            dbUser.groups = dbUser.groups.filter((g) => g.id !== group.id);
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

    return true;
  } catch (error) {
    console.error("Error updating users:", error);
    throw false;
  } finally {
    if (dataSource) {
      await dataSource.destroy();
      console.log("Database connection closed.");
    }
  }
}

export { UpdateUsers };

//---------------

async function CreateChangeListForUsersUpdate(
  users: User[],
  group: Group
): Promise<User[] | null> {
  const updateList: User[] = [];
  let dataSource;

  try {
    dataSource = await instantiateRdsClient();
    const userRepository = dataSource.getRepository(User);

    if (users.length > 0) {
      for (const user of users) {
        const dbUser = await userRepository.findOne({
          where: { username: user.username },
        });

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
    console.error("Error getting user:", error);
    return null;
  } finally {
    if (dataSource) {
      await dataSource.destroy();
      console.log("Database connection closed.");
    }
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
      where: { groupId: group.id, username: user.username },
    });

    if (accounting === null) {
      return true;
    }

    if (Math.abs(accounting.balance) < 0.009) {
      return true;
    }

    return false;
  } catch (error) {
    console.error("Error checking balance:", error);
    return false;
  } finally {
    if (dataSource) {
      await dataSource.destroy();
      console.log("Database connection closed.");
    }
  }
}

export { CheckBalance };
