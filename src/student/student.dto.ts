import { Exclude, Expose, Transform, Type } from "class-transformer";
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { CommonSearchDTO } from "src/common/common.dto";
import { CreatePersonDTO } from "src/common/person/person.dto";
import { GetSchoolDTO } from "src/school/school.dto";

export class CreateStudentDTO extends CreatePersonDTO {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  level: number;

  @Expose()
  @IsIn(["active", "unactive", "cessation", "reserve"])
  enrollmentStatus: string;

  @Expose()
  @IsUUID()
  @IsNotEmpty()
  schoolId: string;

  @Transform(({ value }) => value, { toClassOnly: true })
  unknowProperty: unknown;
}

export class SearchStudentDTO extends CommonSearchDTO {
  @Expose()
  @IsOptional()
  @IsString()
  fullName: string;

  @Expose()
  @IsOptional()
  level: number;

  @IsOptional()
  @Expose()
  @IsIn(["active", "unactive"])
  enrollmentStatus: string;
}
export class UpdateStudentDTO extends CreateStudentDTO {
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @Exclude()
  unknowProperty: never;
}

export class GetStudentDTO extends CreateStudentDTO {
  @Expose()
  id: string;

  @Exclude()
  schoolId: string;
}
