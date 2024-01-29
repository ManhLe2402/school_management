import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  Property,
} from "@mikro-orm/core";
import { EntityCommon } from "src/common/common.entity";
import { SubjectClassEntity } from "src/subjectClass/subjectClass.entity";

@Entity({ schema: "school_management" })
export class SubjectEntity extends EntityCommon {
  @Property({ type: "text" })
  subjectName!: string;

  @Property()
  level!: number;

  @Property()
  creditHour!: number;

  @Property({ type: "text", default: "active" })
  subjectStatus: string;

  @OneToMany(
    () => SubjectClassEntity,
    (subjectClass) => subjectClass.subjectId,
    { cascade: [Cascade.REMOVE] }
  )
  subjectClass = new Collection<SubjectClassEntity>(this);
}
