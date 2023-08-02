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
  
  @Entity('events')
  class Event implements IAddEvent {
    @PrimaryGeneratedColumn('uuid')
    id: string = uuid();
  
    @Column()
    name: string;
  
    @Column()
    picture_path: string;
  
    @Column()
    description: string;
  
    @Column()
    created_by: string;
  
    @CreateDateColumn()
    created_at: Date;
  
    @UpdateDateColumn()
    updated_at: Date;
  }
  
  export default Event;
  