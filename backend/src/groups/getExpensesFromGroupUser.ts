import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { Transaction } from '../models/transaction'; 
import { LessThan } from 'typeorm';
import { createResponse } from '../utils/response-utils';

export const handler: Handler = async (event: any) => {
  let dataSource;
  //path /groups/groupid/users/userid/expense

  try {
    console.log('getExpansesFromGroupUser lambda starts here')

    dataSource = await instantiateRdsClient();
    const transactionRepository = dataSource.getRepository(Transaction);

    const groupId: string = event.pathParameters.groupId; 
    const username: string = event.pathParameters.username;

    const transactions = await transactionRepository.find({
      where: {
        group: { id: groupId },
        receiverUsername: { username: username }, 
        amount: LessThan(0)
      }
    });

    return createResponse(200, transactions);

  } catch (error) {
    console.error('Error fetching transactions:', error);
    return createResponse(500, 'Cannot fetch transactions.');
  }finally{
    if(dataSource){
      await dataSource.destroy();
      console.log('Database connection closed.')
    }
  }
};
