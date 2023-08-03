import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';
import { Transaction } from './transaction';
import { Accounting } from './accounting';
import { Group } from './group'

@Entity('User')
export class User {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  username: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  mail: string;

  @Column({ type: 'varchar', length: 255 })
  number: string | null;

  @OneToMany(() => Accounting, (userBalance) => userBalance.usernameNavigation)
  accountings: Accounting[];

  @OneToMany(() => Transaction, (transaction) => transaction.receiverUsernameNavigation)
  transactionReceiverUsernameNavigations: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.senderUsernameNavigation)
  transactionSenderUsernameNavigations: Transaction[];

  @OneToMany(() => Group, (group) => group.Users)
  groups: Group[];
}