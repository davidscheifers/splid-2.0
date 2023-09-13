import { Handler } from "aws-lambda";
import { instantiateRdsClient } from "../utils/db-connection";
import { User } from "../models/user";
import { createResponse } from "../utils/response-utils";

// Define the Lambda handler function
export const handler: Handler = async (event: any) => {
  let dataSource;
  // Query Parameter: searchTerm=test&username=TestUser

  try {
    // Lambda function starts
    console.log("searchGroupOfUsers lambda starts here");

    // Establishes the database connection
    dataSource = await instantiateRdsClient();

    // Retrieves the repository for users
    console.log("getting users from the database");
    const userRepository = dataSource.getRepository(User);

    // Extracts the username and search term from the event's query parameters
    const username: string = event.queryStringParameters?.username;
    const searchTerm: string = event.queryStringParameters?.searchTerm;

    // Validation of required parameters
    if (searchTerm === null || username === null) {
      return createResponse(400, "Missing search term or username.");
    }

    // Retrieves the user from the database
    const user = await userRepository.findOne({
      where: { username: username },
      relations: ["groups"],
    });

    // If the user was not found, creates an error response
    if (user === null) {
      return createResponse(404, "User not found.");
    }

    // Search result: Groups of the user that contain the search term
    const searchResult = user.groups.filter((g) =>
      g.name.trim().toLowerCase().includes(searchTerm.toLowerCase().trim())
    );

    // Creates a successful response with the search result
    return createResponse(200, searchResult);
  } catch (error) {
    // Error handling
    console.error("Error searching groups:", error);
    return createResponse(500, "Cannot search groups.");
  } finally {
    // Closes the database connection if available
    if (dataSource) {
      await dataSource.destroy();
      console.log("Database connection closed.");
    }
  }
};
