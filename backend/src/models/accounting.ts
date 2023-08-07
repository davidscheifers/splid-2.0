import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import { User } from "./user";
import { Group } from "./group";

@Index("Accounting_pkey", ["groupId", "username"], { unique: true })
@Entity("Accounting", { schema: "evide" })
export class Accounting {
  @Column("character varying", { primary: true, name: "username", length: 255 })
  username: string;

  @Column("double precision", {
    name: "balance",
    precision: 53,
    default: () => "0.0",
  })
  balance: number;

  @Column("uuid", { primary: true, name: "group_id" })
  groupId: string;

  @ManyToOne(() => User, (user) => user.accountings)
  @JoinColumn([{ name: "username", referencedColumnName: "username" }])
  username2: User;

  @ManyToOne(() => Group, (group) => group.accountings)
  @JoinColumn([{ name: "group_id", referencedColumnName: "id" }])
  group: Group;
}
