import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { Bill } from "./bill";
import { User } from "./user";
import { Group } from "./group";

@Index("Transaction_pkey", ["id"], { unique: true })
@Entity("Transaction", { schema: "splid" })
export class Transaction {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("character varying", {
    name: "description",
    nullable: true,
    length: 255,
  })
  description?: string | null;

  @Column("double precision", { name: "amount", precision: 53 })
  amount: number;

  @Column("timestamp with time zone", {
    name: "created_at",
    default: () => "CURRENT_TIMESTAMP",
  })
  createdAt: Date;

  @Column("character varying", { name: "sender_username", nullable: false })
  senderUsername: string;

  @Column("character varying", { name: "receiver_username", nullable: false })
  receiverUsername: string;

  @Column("uuid" , { name: "group_id", nullable: false })
  groupId: string;

  @ManyToOne(() => Bill, (bill) => bill.transactions)
  @JoinColumn([{ name: "bill_id", referencedColumnName: "id" }])
  bill?: Bill;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn([{ name: "receiver_username", referencedColumnName: "username" }])
  receiver?: User;

  @ManyToOne(() => User, (user) => user.transactions2)
  @JoinColumn([{ name: "sender_username", referencedColumnName: "username" }])
  sender?: User;

  @ManyToOne(() => Group, (group) => group.transactions)
  @JoinColumn([{ name: "group_id", referencedColumnName: "id" }])
  group?: Group;
}
