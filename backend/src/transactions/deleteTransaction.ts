import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { Transaction } from '../models/transaction';
import { createResponse } from '../utils/response-utils';

export const handler: Handler = async (event: any) => {
  let dataSource;

  try {
    console.log('deleteTransaction lambda starts here')

    // Initialize the database connection
    dataSource = await instantiateRdsClient();

    console.log('getting transactions from db');
    const transactionRepository = dataSource.getRepository(Transaction);

    // Extract the transaction ID from the path parameters
    const transactionId: string = event.pathParameters.transactionId; 
  
    // Find the transaction by its ID
    const transaction = await transactionRepository.findOne({
      where: { id: transactionId }
    });

    if (!transaction) {
      // If the transaction is not found, return a not found response
      return createResponse(500, 'Transaction not found')
    }
    
    // Delete the transaction
    await transactionRepository.delete(transactionId);

    // Return a successful response
    return createResponse(200, 'Transaction deleted');

  } catch (error) {
    // Error handling: Log the error and return an error response
    console.error('Error deleting transactions:', error);
    return createResponse(500, 'Cannot delete Transaction.');
  } finally {
    // Close the database connection if it was opened
    if (dataSource) {
      await dataSource.destroy();
      console.log('Database connection closed.')
    }
  }
};
