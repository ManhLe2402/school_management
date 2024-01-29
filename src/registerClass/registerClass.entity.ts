import {
  Cascade,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
} from "@mikro-orm/core";
import { EntityCommon } from "src/common/common.entity";
import { StudentEntity } from "src/student/student.entity";
import { SubjectClassEntity } from "src/subjectClass/subjectClass.entity";

@Entity({ schema: "school_management" })
export class ResgisterClassEntity extends EntityCommon {
  @ManyToOne(() => SubjectClassEntity, {
    cascade: [Cascade.REMOVE],
    /* deleteRule: "cascade" */
  })
  subjectClassId: SubjectClassEntity;

  @ManyToOne(() => StudentEntity, { cascade: [Cascade.REMOVE] })
  studentId: StudentEntity;

  @Property({ default: null })
  status: string;
}
