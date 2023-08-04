import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user';
import { Group } from './group';
import { Bill } from './bill';

@Entity('Transaction')
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  description: string | null;

  @Column()
  senderUsername: string;

  @Column()
  receiverUsername: string;

  @Column({ type: 'double precision', nullable: false })
  amount: number;

  @Column({ nullable: true })
  billId: string | null;

  @Column()
  groupId: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @ManyToOne(() => Bill, (bill) => bill.transactions)
  bill: Bill;

  @ManyToOne(() => Group, (group) => group.transactions)
  group: Group;

  @ManyToOne(() => User, (user) => user.transactionReceiverUsernameNavigations)
  receiverUsernameNavigation: User;

  @ManyToOne(() => User, (user) => user.transactionSenderUsernameNavigations)
  senderUsernameNavigation: User;
  
}
