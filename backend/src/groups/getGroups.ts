import { APIGatewayProxyHandler, Handler } from "aws-lambda";
import { instantiateRdsClient } from "../utils/db-connection";
import { Group } from "../models/group";
import { createResponse } from "../utils/response-utils";

// Define the Lambda handler function using the APIGatewayProxyHandler interface
export const handler: APIGatewayProxyHandler = async (event, _context) => {
  let dataSource;

  try {
    // Lambda function starts
    console.log("getGroups lambda starts here");

    // Establishes the database connection
    dataSource = await instantiateRdsClient();

    // Retrieves the repository for groups
    console.log("getting groups from the database");
    const groupRepository = dataSource.getRepository(Group);

    // Retrieves groups from the database
    const groups = await groupRepository.find({
      take: 10, // Limit the number of retrieved groups to 10
    });

    // Creates a successful response with the retrieved groups
    console.log("Successfully retrieved groups.");
    console.log(groups);

    return createResponse(200, groups);
  } catch (error) {
    // Error handling
    console.error("Error getting groups:", error);
    return createResponse(500, "Error getting groups.");
  } finally {
    // Closes the database connection if available
    if (dataSource) {
      await dataSource.destroy();
      console.log("Database connection closed.");
    }
  }
};
