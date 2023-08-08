import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { Transaction } from '../models/transaction'; 
import { MoreThan } from 'typeorm/find-options/operator/MoreThan'; 
import { createResponse } from '../utils/response-utils';

export const handler: Handler = async (event: any) => {
  let dataSource;

  try {
    console.log('getIncomeFromGroupUser lambda starts here')

    dataSource = await instantiateRdsClient();
    const transactionRepository = dataSource.getRepository(Transaction);

    const groupId: string = event.pathParameters.groupId; 
    const username: string = event.pathParameters.username;

    // const transactions = await transactionRepository.find({
    //   where: {
    //     groupId: groupId, ///idk why the field groupID is missing in the transaction model
    //     receiverUsername: username,
    //     amount: MoreThan(0) 
    //   }
    // });

    // return createResponse(200, transactions);

    return createResponse(200, 'Not implemented yet.');

  } catch (error) {
    console.error('Error fetching transactions:', error);
    return createResponse(500, 'Cannot fetch transactions.');
  } finally {
    if (dataSource) {
      await dataSource.destroy();
      console.log('Database connection closed.')
    }
  }
};
