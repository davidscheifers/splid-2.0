import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToMany,
    JoinTable
  } from 'typeorm';
  import { Accounting } from './accounting';
  import { Transaction } from './transaction';
  import { User } from './user';
    
  @Entity()
  export class Group {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 255, nullable: false })
    name: string;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    picturePath: string | null;
  
    @Column({ type: 'varchar', length: 255, nullable: true })
    description: string | null;
  
    @Column({ type: 'varchar', nullable: false })
    createdBy: string;
  
    @CreateDateColumn({ type: 'timestamp with time zone', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamp with time zone', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
  
    @OneToMany(() => Accounting, (userBalance) => userBalance.group)
    accountings: Accounting[];
  
    @OneToMany(() => Transaction, (transaction) => transaction)
    transactions: Transaction[];

    @ManyToMany(() => User)
    @JoinTable()
    Users?: User[]; 
  }
  