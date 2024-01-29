import { Property } from "@mikro-orm/core";
import { EntityCommon } from "../common.entity";

export class PersonEntiy extends EntityCommon {
  @Property({ type: "text" })
  firstName: string;

  @Property({ type: "text" })
  lastName!: string;

  @Property()
  address!: string;

  @Property()
  gender!: string;

  @Property({ type: "timestamp" })
  dateOfBirth!: Date;

  @Property()
  phone!: string;

  @Property()
  email: string = null;
}
