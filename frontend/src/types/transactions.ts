export type Transaction = {
    id: string;
    description: string;
    amount: number;
    createdAt: string;
    senderUsername: string;
    receiverUsername: string;
    groupId: string;
};
