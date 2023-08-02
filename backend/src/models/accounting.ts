import { Entity, Column, PrimaryColumn, ManyToOne } from 'typeorm';
import { User } from './user';
import { Group } from './group';

@Entity('Accounting', { schema: 'evide' })
export default class Accounting {
  @ManyToOne(() => User, (user) => user.username)
  @PrimaryColumn({ type: 'varchar', length: 255, collation: 'pg_catalog."default"', nullable: false })
  username: string;

  @ManyToOne(() => Group, (group) => group.id)
  @PrimaryColumn({ type: 'uuid', nullable: false })
  group_id: string;

  @Column({ type: 'double precision', nullable: false, default: 0.0 })
  balance: number;
}