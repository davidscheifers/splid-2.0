import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { Transaction } from '../models/transaction';
import { createResponse } from '../utils/response-utils';

export const handler: Handler = async (event: any) => {
  let dataSource;

  try {
    console.log('createTransactions lambda starts here')

    dataSource = await instantiateRdsClient();

    const transactionRepository = dataSource.getRepository(Transaction);

    const inputTransactions: Transaction[] = JSON.parse(event.body);

    const createdTransactions = await transactionRepository.save(inputTransactions);

    return createResponse(200, createdTransactions);

  } catch (error) {
    console.error('Error creating transactions:', error);
    return createResponse(500, 'Cannot create Transactions.');
  } finally {
    if (dataSource) {
      await dataSource.destroy();
      console.log('Database connection closed.')
    }
  }
};