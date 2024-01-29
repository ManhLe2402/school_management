import { Exclude, Expose } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";
import { CommonSearchDTO } from "src/common/common.dto";

export class CreateSubjectDTO {
  @Expose()
  @IsNotEmpty()
  @IsString()
  subjectName: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  level: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  creditHour: number;

  @IsOptional()
  @IsString()
  subjectStatus: string;
}

export class GetSubjectDTO extends CreateSubjectDTO {
  @Expose()
  id: string;
}
export class UpdateSubjectDTO extends CreateSubjectDTO {
  @Expose()
  @IsNotEmpty()
  @IsUUID()
  id: string;
}
export class SearchSubjectDTO extends CommonSearchDTO {
  @Expose()
  subjectName: string;
}
