import { Handler } from "aws-lambda";
import { In } from "typeorm";
import { instantiateRdsClient } from "../utils/db-connection";
import { Group } from "../models/group";
import { User } from "../models/user";
import { createResponse } from "../utils/response-utils";

// Defines the Lambda handler function
export const handler: Handler = async (event: any) => {
  let dataSource;
  // request body: multipart/form-data
  // string($uuid)
  // Name
  // string
  // Description
  // string
  // Users
  // array
  // Picture
  // string($binary)

  try {
    // Lambda function starts
    console.log("addGroup lambda starts here");

    // Establishes the data connection
    dataSource = await instantiateRdsClient();

    // Retrieves database repositories for Group and User
    console.log("getting groups and users from the database");
    const groupRepository = dataSource.getRepository(Group);
    const userRepository = dataSource.getRepository(User);

    // Parses input group data from the event object
    const inputGroup: Group = JSON.parse(event.body);

    // Validation of required fields
    if (inputGroup.name === null || inputGroup.createdBy === null) {
      return createResponse(
        400,
        "Cannot create group. Missing required fields."
      );
    }

    // Prepares ID and timestamps
    inputGroup.id = ""; // new UUID? or is this handled automatically by TypeORM?
    inputGroup.createdAt = new Date(Date.now());
    inputGroup.updatedAt = new Date(Date.now());

    // Array for usernames is created
    const usernames = new Array<string>();

    // Extracts usernames from the input data
    if (inputGroup.users == null) {
      usernames.push(inputGroup.createdBy);
    } else {
      usernames.push(...inputGroup.users.map((u) => u.username));
      if (!usernames.includes(inputGroup.createdBy)) {
        usernames.push(inputGroup.createdBy);
      }
    }

    // User data is retrieved from the database
    inputGroup.users = await userRepository.find({
      where: { username: In(usernames) },
    });

    // Group data is saved in the database
    await groupRepository.save(inputGroup);

    // Closes the database connection
    await dataSource.destroy();

    // Successful response is created
    return createResponse(200, inputGroup);

    // Error handling
  } catch (error) {
    console.error("Error adding group:", error);
    return createResponse(500, "Cannot add group.");
  } finally {
    // Closes the database connection if available
    if (dataSource) {
      await dataSource.destroy();
      console.log("Database connection closed.");
    }
  }
};
