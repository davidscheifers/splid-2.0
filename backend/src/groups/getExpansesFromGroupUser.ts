import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { Transaction } from '../models/transaction'; // Import your entity
import { LessThan } from 'typeorm/find-options/operator/LessThan';

export const handler: Handler = async (event: any) => {
  let dataSource;

  try {
    dataSource = await instantiateRdsClient();
    const transactionRepository = dataSource.getRepository(Transaction);

    const groupId: string = event.groupId; // Assuming groupId is passed as part of the event payload
    const username: string = event.username; // Assuming username is passed as part of the event payload

    //Same Probleme here transaction doesnt have the group property yet

    const transactions = await transactionRepository.find({
      where: {
        //groupId: groupId,
        receiverUsername: username,
        amount: LessThan(0)
      }
    });

    // Close the connection when you're done
    await dataSource.destroy();

    return transactions;

  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};
