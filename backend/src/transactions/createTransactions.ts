import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { Transaction } from '../models/transaction';
import { createResponse } from '../utils/response-utils';
import { v4 as uuidv4 } from 'uuid';

export const handler: Handler = async (event: any) => {
  let dataSource;
    // {
  //   "description": "string",
  //   "senderUsername": "string",
  //   "receiverUsername": "string",
  //   "amount": 0,
  //   "groupId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
  // }

  try {
    console.log('createTransactions lambda starts here')

    dataSource = await instantiateRdsClient();

    const transactionRepository = dataSource.getRepository(Transaction);

    const inputTransactions: Transaction[] = JSON.parse(event.body);

    if (Array.isArray(inputTransactions)) { //more than one transaction
      inputTransactions.forEach(transaction => {
        transaction.createdAt = new Date(Date.now());
        transaction.id = uuidv4(),
        console.log(transaction);
      });

      const createdTransactions = await transactionRepository.save(inputTransactions);
      return createResponse(200, createdTransactions);

    }else{ //only one transaction
      const inputTransaction: Transaction = JSON.parse(event.body);
      inputTransaction.createdAt = new Date(Date.now());
      inputTransaction.id = uuidv4(),
      console.log(inputTransaction);

      const createdTransactions = await transactionRepository.save(inputTransaction);
      return createResponse(200, createdTransactions);
    }
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