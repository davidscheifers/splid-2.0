import { Column, Entity, Index, ManyToMany, OneToMany } from "typeorm";
import { Accounting } from "./accounting";
import { User } from "./user";
import { Transaction } from "./transaction";

@Index("Group_pkey", ["id"], { unique: true })
@Entity("Group", { schema: "evide" })
export class Group {
  @Column("character varying", { name: "name", length: 255 })
  name: string;

  @Column("character varying", {
    name: "picture_path",
    nullable: true,
    length: 255,
  })
  picturePath: string | null;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 255,
  })
  description: string | null;

  @Column("character varying", { name: "created_by" })
  createdBy: string;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("timestamp with time zone", {
    name: "update_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  updatedAt: Date;

  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @OneToMany(() => Accounting, (accounting) => accounting.group)
  accountings: Accounting[];

  @ManyToMany(() => User, (user) => user.groups)
  users: User[];

  @OneToMany(() => Transaction, (transaction) => transaction.group)
  transactions: Transaction[];
}
