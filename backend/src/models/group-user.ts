import { Entity, PrimaryColumn, ManyToOne } from 'typeorm';
import { User } from './user';
import { Group } from './group';

@Entity('Group_User', { schema: 'evide' })
export class Group_User {
  @ManyToOne(() => User, (user) => user.username)  
  @PrimaryColumn({ type: 'varchar', length: 255, collation: 'pg_catalog."default"', nullable: false })
  username: string;

  @ManyToOne(() => Group, (group) => group.id)
  @PrimaryColumn({ type: 'uuid', nullable: false })
  group_id: string;
}