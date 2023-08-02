import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('User', { schema: 'evide' })
export class User {
  @PrimaryColumn({ type: 'varchar', length: 255, collation: 'pg_catalog."default"' })
  username: string;

  @Column({ type: 'varchar', length: 255, collation: 'pg_catalog."default"', nullable: false })
  password: string;

  @Column({ type: 'varchar', length: 255, collation: 'pg_catalog."default"', nullable: false })
  mail: string;

  @Column({ type: 'varchar', length: 255, collation: 'pg_catalog."default"' })
  number: string;
}