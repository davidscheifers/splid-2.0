import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { Transaction } from '../models/transaction';
import { createResponse } from '../utils/response-utils';
import { v4 as uuidv4 } from 'uuid';

export const handler: Handler = async (event: any) => {
  let dataSource;
  // Expected JSON input structure for a single transaction or an array of transactions
  /*
  {
    "description": "string",
    "senderUsername": "string",
    "receiverUsername": "string",
    "amount": 0,
    "groupId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  }
  */

  try {
    console.log('createTransactions lambda starts here')

    // Initialize the database connection
    dataSource = await instantiateRdsClient();

    const transactionRepository = dataSource.getRepository(Transaction);

    // Parse the incoming transaction data from the event body
    const inputTransactions: Transaction[] = JSON.parse(event.body);

    if (Array.isArray(inputTransactions)) { // Check if there are multiple transactions
      // For each transaction, set createdAt and generate a unique ID
      inputTransactions.forEach(transaction => {
        transaction.createdAt = new Date(Date.now());
        transaction.id = uuidv4();
        console.log(transaction);
      });

      // Save all the created transactions and return them
      const createdTransactions = await transactionRepository.save(inputTransactions);
      return createResponse(200, createdTransactions);

    } else { // Single transaction
      // Set createdAt and generate a unique ID for the transaction
      const inputTransaction: Transaction = JSON.parse(event.body);
      inputTransaction.createdAt = new Date(Date.now());
      inputTransaction.id = uuidv4();
      console.log(inputTransaction);

      // Save the single transaction and return it
      const createdTransaction = await transactionRepository.save(inputTransaction);
      return createResponse(200, createdTransaction);
    }
  } catch (error) {
    // Error handling: Log the error and return an error response
    console.error('Error creating transactions:', error);
    return createResponse(500, 'Cannot create Transactions.');
  } finally {
    // Close the database connection if it was opened
    if (dataSource) {
      await dataSource.destroy();
      console.log('Database connection closed.')
    }
  }
};
