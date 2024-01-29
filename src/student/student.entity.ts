import {
  Cascade,
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from "@mikro-orm/core";

import { PersonEntiy } from "src/common/person/person.entity";
import { ResgisterClassEntity } from "src/registerClass/registerClass.entity";
import { SchoolEntity } from "src/school/school.entity";

@Entity({ schema: "school_management" })
export class StudentEntity extends PersonEntiy {
  @Property()
  level!: number;

  @Property({ default: "active" })
  enrollmentStatus!: string;

  @ManyToOne(() => SchoolEntity, { cascade: [Cascade.REMOVE] })
  schoolId!: string;
}
