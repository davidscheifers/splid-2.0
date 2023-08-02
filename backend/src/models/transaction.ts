import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './user';
import { Group } from './group';
import { Bill } from './bill';

@Entity('Transaction', { schema: 'evide' })
export class Transaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, collation: 'pg_catalog."default"' })
  description: string;

  @ManyToOne(() => User, (user) => user.username) 
  sender_username: string;

  @Column({ type: 'double precision', nullable: false })
  amount: number;

  @ManyToOne(() => Bill, (bill) => bill.id)
  bill_id: string;

  @ManyToOne(() => Group, (group) => group.id)
  group_id: string;

  @CreateDateColumn({ type: 'timestamp with time zone', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => User, (user) => user.username) 
  receiver_username: string;
}
