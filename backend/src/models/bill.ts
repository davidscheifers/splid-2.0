import { Column, Entity, Index, OneToMany } from "typeorm";
import { Transaction } from "./transaction";

@Index("Bill_pkey", ["id"], { unique: true })
@Entity("Bill", { schema: "splid" })
export class Bill {
  @Column("uuid", { primary: true, name: "id" })
  id: string;

  @Column("character varying", { name: "path", length: 255 })
  path: string;

  @OneToMany(() => Transaction, (transaction) => transaction.bill)
  transactions: Transaction[];
}
