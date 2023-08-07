import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { Transaction } from '../models/transaction'; 
import { Group } from '../models/group'; 
import { LessThan } from 'typeorm/find-options/operator/LessThan';

export const handler: Handler = async (event: any) => {
  let dataSource;

  try {
    dataSource = await instantiateRdsClient();
    const transactionRepository = dataSource.getRepository(Transaction);

    const groupId: string = event.groupId; 
    const username: string = event.username;

    // const transactions = await transactionRepository.find({
    //   where: {
    //     groupId: groupId,
    //     receiverUsername: username,
    //     amount: LessThan(0)
    //   }
    // });

    // Close the connection when you're done
    await dataSource.destroy();

    // return transactions;

    return null;

  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};
