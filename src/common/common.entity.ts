import { Entity, PrimaryKey, Property, Unique } from "@mikro-orm/core";
import { Expose } from "class-transformer";

export class EntityCommon {
  @PrimaryKey({ type: "uuid" })
  @Unique()
  id!: string;

  @Property()
  createAt = new Date();
  @Property({ onUpdate: () => new Date() })
  updateAt = new Date();
  @Property({ type: "timestamptz" })
  deleteAt = null;
}
