import { Handler } from "aws-lambda";
import { instantiateRdsClient } from "../utils/db-connection";
import { Group } from "../models/group";
import { User } from "../models/user";
import { createResponse } from "../utils/response-utils";

// Defines the Lambda handler function
export const handler: Handler = async (event: any) => {
  let dataSource;
  // Path structure: Groups/uuid

  try {
    // Lambda function starts
    console.log("deleteGroup lambda starts here");

    // Establishes the database connection
    dataSource = await instantiateRdsClient();

    // Retrieves database repositories for Group and User
    console.log("getting groups and users from the database");
    const groupRepository = dataSource.getRepository(Group);
    const userRepository = dataSource.getRepository(User);

    // Extracts the group ID from the event's path parameters
    const groupId: string = event.pathParameters.groupId;

    console.log(groupId);

    // Retrieves the group with associated users from the database
    const group = await groupRepository.findOne({
      where: { id: groupId },
      relations: ["users"],
    });

    // If the group was not found, creates an error response
    if (group === null) {
      return createResponse(500, "group not found");
    }

    // Removes all users from the group
    group.users = [];

    // Saves the modified group in the database and then removes it
    await groupRepository.save(group);
    await groupRepository.remove(group);

    // Creates a successful response
    return createResponse(200, "group deleted");
  } catch (error) {
    // Error handling
    console.error("Error deleting group:", error);
    return createResponse(500, "Cannot delete group.");
  } finally {
    // Closes the database connection if available
    if (dataSource) {
      await dataSource.destroy();
      console.log("Database connection closed.");
    }
  }
};
