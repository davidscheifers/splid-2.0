import { Handler } from "aws-lambda";
import { instantiateRdsClient } from "../utils/db-connection";
import { Accounting } from "../models/accounting"; // Make sure to specify the correct path to the Accounting model
import { createResponse } from "../utils/response-utils";

export const handler: Handler = async (event: any) => {
  let dataSource;
  // Path: /Accounting/{groupId}

  try {
    console.log("getAccountingFromGroup lambda starts here");

    // Initialize the database connection
    dataSource = await instantiateRdsClient();
    const accountingRepository = dataSource.getRepository(Accounting);

    // Check if the "groupId" parameter is present in the event payload
    const groupId = event.pathParameters.groupId;
    if (!groupId) {
      // If groupId is missing, return a bad request response
      return createResponse(400, "groupId is required.");
    }

    // Search for all Accounting records in the database that belong to the given groupId
    const accountingFromGroup = await accountingRepository.find({
      where: { groupId },
    });
    if (accountingFromGroup.length === 0) {
      // If no accounting records are found, return a not found response
      return createResponse(404, "No Accounting records found.");
    }
    
    // Return a successful response with the accounting records
    return createResponse(200, accountingFromGroup);

  } catch (error) {
    // Error handling: Log the error and return an error response
    console.error("Error retrieving Accounting records for the group:", error);
    return createResponse(500, "Cannot retrieve Accounting records.");
  } finally {
    // Close the database connection if it was opened
    if (dataSource) {
      await dataSource.destroy();
      console.log('Database connection closed.')
    }
  }
};
