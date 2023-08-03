import { Entity, Column, ManyToOne } from 'typeorm';
import { User } from './user';
import { Group } from './group';

@Entity('Accounting')
export class Accounting {
  @Column({ type: 'varchar', length: 255, nullable: false })
  username: string;

  @Column({ type: 'double precision', nullable: false, default: 0.0 })
  balance: number;

  @Column({ type: 'uuid', nullable: false })
  groupId: string;

  @ManyToOne(() => Group, (group) => group.accountings)
  group: Group;

  @ManyToOne(() => User, (user) => user.accountings)
  usernameNavigation: User;
}