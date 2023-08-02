import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
  } from 'typeorm';
  import { v4 as uuid } from 'uuid';
  
  interface IAddEvent {
    id: string;
    name: string;
    picture_path: string;
    description: string;
    created_by: string;
    created_at: Date;
    updated_at: Date;
  }
  
  @Entity('Group') // Note the matching name to your SQL table
  class Group implements IAddEvent {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();
  
    @Column('character varying', { length: 255, nullable: false })
    name: string;
  
    @Column('character varying', { length: 255, nullable: true })
    picture_path: string;
  
    @Column('character varying', { length: 255, nullable: true })
    description: string;
  
    @Column('character varying', { nullable: false })
    created_by: string;
  
    @CreateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;
  
    @UpdateDateColumn({ type: 'timestamp with time zone', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;
  }
  
  export default Group;
  