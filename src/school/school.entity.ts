import {
  Cascade,
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  Unique,
} from "@mikro-orm/core";
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPhoneNumber,
  IsString,
  MinLength,
} from "class-validator";
import { EntityCommon } from "src/common/common.entity";
import { StudentEntity } from "src/student/student.entity";
import { TeacherEntity } from "src/teacher/teacher.entity";

@Entity({ schema: "school_management" })
export class SchoolEntity extends EntityCommon {
  @Property({ type: "text" })
  schoolName: string;

  @Property({ type: "text" })
  address: string;

  @Property({ type: "text" })
  email: string;

  @Property({ type: "text" })
  hotline: string;

  @Property()
  dateEstablished: number;

  @Property()
  typeOfEducation: number;

  @Property({ type: "text" })
  description: string = "";

}
