import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('Bill', { schema: 'evide' })
export class Bill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, collation: 'pg_catalog."default"', nullable: false })
  path: string;
}