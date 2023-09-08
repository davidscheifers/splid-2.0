import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { Accounting } from '../models/accounting'; 
import { Transaction } from '../models/transaction';
import { createResponse } from '../utils/response-utils';
import { v4 as uuidv4 } from 'uuid';

export const handler: Handler = async (event: any) => {
  let dataSource;
  // Path: /Accounting/{groupId}/settle-debts

  try {
    console.log('getSettlingDebtsTransactions lambda starts here');

    // Initialize the database connection
    dataSource = await instantiateRdsClient();
    const accoutingRepository = dataSource.getRepository(Accounting);

    // Extract the groupId from the path parameters
    const groupId: string = event.pathParameters.groupId;

    // Find all users in the group
    const users = await accoutingRepository.find({
      where: { groupId: groupId }
    });

    console.log('users:', users);

    // Calculate and generate settling debt transactions
    const transactions = SettleBalances(users);

    if (transactions) {
      // If transactions are generated successfully, return them
      return createResponse(200, transactions);
    } else {
      // If settling balances fails or balances do not match, return an error response
      return createResponse(400, 'Cannot settle balances or balances do not match.');
    }
  } catch (error) {
    // Error handling: Log the error and return an error response
    console.error('Error settling transactions:', error);
    return createResponse(500, 'Cannot settle transactions.');
  } finally {
    // Close the database connection if it was opened
    if (dataSource) {
      await dataSource.destroy();
      console.log('Database connection closed.');
    }
  }
};

function SettleBalances(users: Accounting[]): Transaction[] | null {
  if (!users || users.length === 0) {
    return null;
  }

  let totalBalance = 0;

  const creditors: Accounting[] = [];
  const debtors: Accounting[] = [];

  // Calculate total balances and separate users into creditors and debtors
  for (const u of users) {
    totalBalance += u.balance; 
    if (u.balance > 0) {
      creditors.push(u);
    } else {
      debtors.push(u);
    }
  }

  console.log('creditors:', creditors);
  console.log('debtors:', debtors);

  // Check if the total balance is close to zero (within a tolerance)
  if (Math.abs(totalBalance) > 0.009) {
    return null;
  }

  // Sort creditors and debtors by balance in descending order
  creditors.sort((x, y) => y.balance - x.balance);
  debtors.sort((x, y) => Math.abs(y.balance) - Math.abs(x.balance));

  const transactions: Transaction[] = [];
  let c = 0, d = 0;

  // Generate settling debt transactions
  while (c < creditors.length && d < debtors.length) {
    const creditor = creditors[c];
    const debtor = debtors[d];
    const amount = Math.min(creditor.balance, Math.abs(debtor.balance));

    if (amount !== 0) {
      transactions.push({ 
        id: uuidv4(),
        senderUsername: debtor.username, 
        receiverUsername: creditor.username,
        amount: amount,
        groupId: creditor.groupId,
        createdAt: new Date()
      });
    }

    creditor.balance -= amount;
    debtor.balance += amount;

    if (creditor.balance === 0) {
      c++;
    }
    if (debtor.balance === 0) {
      d++;
    }
  }

  return transactions;
}
