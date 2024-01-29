import { Exclude, Expose, Transform, Type } from "class-transformer";
import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { CommonSearchDTO } from "src/common/common.dto";
import { GetSubjectDTO } from "src/subject/subject.dto";

import { GetTeacherDTO } from "src/teacher/teacher.dto";

export class CreateSubjectClassDTO {
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  teacherId: string;

  @Expose()
  @IsNotEmpty()
  @IsUUID()
  subjectId: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  maxQuantity: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  minQuantity: number;

  @Expose()
  @IsNotEmpty()
  @IsDateString()
  startAt: Date;

  @Expose()
  @IsNotEmpty()
  @IsDateString()
  endAt: Date;

  @Expose()
  @IsNotEmpty()
  @IsString()
  classRoom: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  academicYear: number;

  @Expose()
  @IsString()
  @IsIn(["active", "unactive"])
  classStatus: string;

  @Transform(({ value }) => value, { toClassOnly: true })
  unwantedProperty?: any;
}

@Exclude()
export class GetSubjectClassDTO extends CreateSubjectClassDTO {
  @Expose({ toClassOnly: true })
  id: string;

  @Expose()
  @Type(() => GetSubjectDTO)
  subjectId: string;

  @Expose()
  @Type(() => GetTeacherDTO)
  teacherId: string;
}
export class UpdateSubjectClassDTO extends CreateSubjectClassDTO {
  @Expose()
  @IsNotEmpty()
  id: string;

  @Exclude()
  unwantedProperty: never;
}
export class SearchSubjectClassDTO extends CommonSearchDTO {
  @IsOptional()
  @IsUUID()
  subjectId: string;

  @IsOptional()
  @IsUUID()
  teacherId: string;

  @IsOptional()
  @IsNumber()
  academicYear: number;
}

// export class GetListSubjectClassDTO extends GetSubjectClassDTO {
//   @Expose()
//   subjectId: GetDataSubjectDTO;
// }
