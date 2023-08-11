import { Handler } from 'aws-lambda';
import { instantiateRdsClient } from '../utils/db-connection';
import { Accounting } from '../models/accounting'; 
import { Transaction } from '../models/transaction';
import { createResponse } from '../utils/response-utils';
import { v4 as uuidv4 } from 'uuid';

export const handler: Handler = async (event: any) => {
  let dataSource;
  ////path /Accounting/groupid/settle-debts

  try {
    console.log('getSettlingDebtsTransactions lambda starts here');

    dataSource = await instantiateRdsClient();
    const accoutingRepository = dataSource.getRepository(Accounting);

    const groupId: string = event.pathParameters.groupId;

    const users = await accoutingRepository.find({
      where: { groupId: groupId }
    });

    const transactions =SettleBalances(users);

    if (transactions) {
      return createResponse(200, transactions);
    } else {
      return createResponse(400, 'Cannot settle balances or balances do not match.');
    }
  } catch (error) {
    console.error('Error settling transactions:', error);
    return createResponse(500, 'Cannot settle transactions.');
  } finally {
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

  for (const u of users) {
    totalBalance += u.balance; 
    if (u.balance > 0) {
      creditors.push(u);
    } else {
      debtors.push(u);
    }
  }

  if (Math.abs(totalBalance) > 0.009) {
    return null;
  }

  creditors.sort((x, y) => y.balance - x.balance);
  debtors.sort((x, y) => Math.abs(y.balance) - Math.abs(x.balance));

  const transactions: Transaction[] = [];
  let c = 0, d = 0;
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

