import { Handler } from "aws-lambda";
import { instantiateRdsClient } from "../utils/db-connection";
import { Transaction } from "../models/transaction";
import { MoreThan } from "typeorm";
import { createResponse } from "../utils/response-utils";

// Define the Lambda handler function
export const handler: Handler = async (event: any) => {
  let dataSource;
  // Path structure: /groups/groupid/users/userid/income

  try {
    // Lambda function starts
    console.log("getIncomeFromGroupUser lambda starts here");

    // Establishes the database connection
    dataSource = await instantiateRdsClient();

    // Retrieves the repository for transactions
    const transactionRepository = dataSource.getRepository(Transaction);

    // Extracts the group ID and username from the event's path parameters
    const groupId: string = event.pathParameters.groupId;
    const username: string = event.pathParameters.username;

    // Retrieves income transactions from the database
    const transactions = await transactionRepository.find({
      where: {
        group: { id: groupId },
        receiver: { username: username },
        amount: MoreThan(0), // Only income is queried (positive amounts)
      },
    });

    // Creates a successful response with the retrieved transactions
    return createResponse(200, transactions);
  } catch (error) {
    // Error handling
    console.error("Error fetching transactions:", error);
    return createResponse(500, "Cannot fetch transactions.");
  } finally {
    // Closes the database connection if available
    if (dataSource) {
      await dataSource.destroy();
      console.log("Database connection closed.");
    }
  }
};
