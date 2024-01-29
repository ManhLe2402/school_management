import { Exclude, Expose, Transform, Type } from "class-transformer";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { CommonSearchDTO } from "src/common/common.dto";
import { GetStudentDTO } from "src/student/student.dto";
import { GetSubjectClassDTO } from "src/subjectClass/subjectClass.dto";

export class CreateRegisterClassDTO {
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  studentId: string;

  @Expose()
  @IsNotEmpty()
  @IsUUID()
  subjectClassId: string;

  @Expose()
  @IsString()
  status: string;

  @Transform(({ value }) => value, { toClassOnly: true })
  unknowProperty: unknown;
}

export class UpdateRegisterClassDTO extends CreateRegisterClassDTO {
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  id: string;

  @Exclude()
  unknowProperty: never;
}

export class SearchRegisterClassDTO extends CommonSearchDTO {
  @IsOptional()
  @Expose()
  @IsUUID()
  studentId: string;

  @IsOptional()
  @Expose()
  @IsUUID()
  subjectClassId: string;
}

export class GetRegisterClassDTO extends UpdateRegisterClassDTO {
  @Expose()
  @Type(() => GetStudentDTO)
  studentId: string;

  @Expose()
  @Type(() => GetSubjectClassDTO)
  subjectClassId: string;
}
