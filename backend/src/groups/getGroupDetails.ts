import { Handler } from "aws-lambda";
import { instantiateRdsClient } from "../utils/db-connection";
import { Group } from "../models/group";
import { createResponse } from "../utils/response-utils";

// Defines the Lambda handler function
export const handler: Handler = async (event: any) => {
  let dataSource;
  // Path structure: /users/userid/

  try {
    // Lambda function starts
    console.log("getGroupDetails lambda starts here");

    // Establishes the database connection
    dataSource = await instantiateRdsClient();

    // Retrieves the repository for groups
    console.log("getting groups from the database");
    const groupRepository = dataSource.getRepository(Group);

    // Extracts the group ID from the event's path parameters
    const groupId: string = event.pathParameters.groupId;

    // Retrieves group data from the database
    const group = await groupRepository.findOne({
      where: { id: groupId },
      relations: ["users", "accountings"], // Relationships can be retrieved using relations
    });

    // Creates a successful response with the retrieved group data
    console.log("Successfully retrieved group.");
    console.log(group);

    return createResponse(200, group);
  } catch (error) {
    // Error handling
    console.error("Error getting group:", error);
    return createResponse(500, "Cannot get group.");
  } finally {
    // Closes the database connection if available
    if (dataSource) {
      await dataSource.destroy();
      console.log("Database connection closed.");
    }
  }
};
