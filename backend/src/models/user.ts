import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
} from "typeorm";
import { Accounting } from "./accounting";
import { Group } from "./group";
import { Transaction } from "./transaction";

@Index("User_pkey", ["username"], { unique: true })
@Entity("User", { schema: "splid" })
export class User {
  @Column("character varying", { primary: true, name: "username", length: 255 })
  username: string;

  @Column("character varying", { name: "password", length: 255 })
  password: string;

  @Column("character varying", { name: "mail", length: 255 })
  mail: string;

  @Column("character varying", { name: "number", nullable: true, length: 255 })
  number: string | null;

  @OneToMany(() => Accounting, (accounting) => accounting.username2)
  accountings: Accounting[];

  @ManyToMany(() => Group, (group) => group.users)
  @JoinTable({
    name: "Group_User",
    joinColumns: [{ name: "username", referencedColumnName: "username" }],
    inverseJoinColumns: [{ name: "group_id", referencedColumnName: "id" }],
    schema: "splid",
  })
  groups: Group[];

  @OneToMany(() => Transaction, (transaction) => transaction.receiverUsername)
  transactions: Transaction[];

  @OneToMany(() => Transaction, (transaction) => transaction.senderUsername)
  transactions2: Transaction[];
}
