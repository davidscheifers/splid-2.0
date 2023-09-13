import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { Transaction } from '../models/transaction';
import { createResponse } from '../utils/response-utils';

export const handler: Handler = async (event: any) => {
  let dataSource;

  try {
    console.log('updateTransaction lambda starts here')

    // Initialize the database connection
    dataSource = await instantiateRdsClient();

    console.log('getting transactions from db');
    const transactionRepository = dataSource.getRepository(Transaction);

    // Extract the transaction ID from the path parameters
    const transactionId: string = event.pathParameters.transactionId; 
    // Parse the incoming transaction data from the event body
    const inputTransaction: Transaction = JSON.parse(event.body);

    // Find the transaction by its ID
    const transaction = await transactionRepository.findOne({
      where: { id: transactionId }
    });

    if (!transaction) {
      // If the transaction is not found, return a not found response
      return createResponse(500, 'Transaction not found')
    };

    // Update the transaction with the provided data
    await transactionRepository.update(transactionId, inputTransaction)

    // Return a successful response
    return createResponse(200, 'Transaction updated successfully.');

  } catch (error) {
    // Error handling: Log the error and return an error response
    console.error('Error updating transaction:', error);
    return createResponse(500, 'Cannot update transaction.');
  } finally {
   if (dataSource) {
     await dataSource.destroy();
     console.log('Database connection closed.')
   }
  }
};
