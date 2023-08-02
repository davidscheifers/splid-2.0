import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
    
  @Entity('Group') 
  export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255, collation: 'pg_catalog."default"', nullable: false })
  name: string;

  @Column({ type: 'varchar', length: 255, collation: 'pg_catalog."default"' })
  picture_path: string;

  @Column({ type: 'varchar', length: 255, collation: 'pg_catalog."default"' })
  description: string;

  @Column({ type: 'varchar', collation: 'pg_catalog."default"', nullable: false })
  created_by: string;

  @CreateDateColumn({ type: 'timestamp with time zone', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp with time zone', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;
  }
  