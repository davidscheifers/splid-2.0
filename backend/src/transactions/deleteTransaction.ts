import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { Transaction } from '../models/transaction';
import { createResponse } from '../utils/response-utils';

export const handler: Handler = async (event: any) => {
  let dataSource;
  //path: /transactions/{transactionId} 

  try {
    console.log('deleteTransaction lambda starts here')

    dataSource = await instantiateRdsClient();

    console.log('getting transactions from db');
    const transactionRepository = dataSource.getRepository(Transaction);

    const transactionId: string = event.pathParameters.transactionId; 
  
    const transaction = await transactionRepository.findOne({
      where: { id: transactionId }
    });

    if (!transaction) {
      return createResponse(500, 'Transaction not found')
    }
    
    await transactionRepository.delete(transactionId);

    return createResponse(200, 'Transaction deleted');

  } catch (error) {
    console.error('Error deleting transactions:', error);
    return createResponse(500, 'Cannot delete Transaction.');
  } finally {
    if (dataSource) {
      await dataSource.destroy();
      console.log('Database connection closed.')
    }
  }
};