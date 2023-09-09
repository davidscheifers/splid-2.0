import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { Transaction } from '../models/transaction';
import { createResponse } from '../utils/response-utils';

export const handler: Handler = async (event: any) => {
  let dataSource;
  //path: /transactions/{transactionId}
//   {
//     "id": "b5083749-84aa-414f-b219-7ccd10dc535d",
//     "description": "test2",
//     "amount": 24,
//     "createdAt": "2023-08-11T18:21:01.734Z",
//     "senderUsername": "tester",
//     "receiverUsername": "admin",
//     "groupId": "5aa66f64-5717-4562-b3fc-2c963f66afa6"
// }


  try {
    console.log('updateTransaction lambda starts here')

    dataSource = await instantiateRdsClient();

    console.log('getting transactions from db');
    const transactionRepository = dataSource.getRepository(Transaction);

    const transactionId: string = event.pathParameters.transactionId; 
    const inputTransaction: Transaction = JSON.parse(event.body);

    const transaction = await transactionRepository.findOne({
      where: { id: transactionId }
    });

    if (!transaction) {
      return createResponse(500, 'Transaction not found')
    };

    await transactionRepository.update(transactionId, inputTransaction)

    return createResponse(200, 'Transaction updated successfully.');

  } catch (error) {
    console.error('Error updating transaction:', error);
    return createResponse(500, 'Cannot update transaction.');
  } finally {
   if (dataSource) {
     await dataSource.destroy();
     console.log('Database connection closed.')
   }
  }
};