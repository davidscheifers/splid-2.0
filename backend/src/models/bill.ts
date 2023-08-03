import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from './transaction';

@Entity()
export class Bill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, collation: 'pg_catalog."default"', nullable: true })
  path: string | null;

  @OneToMany(() => Transaction, (transaction) => transaction.bill)
  transactions: Transaction[];
}