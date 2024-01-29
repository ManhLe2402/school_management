import { Exclude, Expose, Transform } from "class-transformer";
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";
import { CommonSearchDTO } from "src/common/common.dto";

export class CreateSchoolDTO {
  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  schoolName: string;

  @Expose()
  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  address: string;

  @Expose()
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  hotline: string;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  dateEstablished: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  typeOfEducation: number;

  @IsOptional()
  @Expose()
  @IsString()
  description: string = "";

  @Transform(({ value }) => value, { toClassOnly: true })
  unwantedProperty?: any;
}

export class GetSchoolDTO extends CreateSchoolDTO {
  @Expose()
  id: string;
}

export class UpdateSchoolDTO extends CreateSchoolDTO {
  @IsNotEmpty()
  @Expose()
  @IsUUID()
  id: string;

  @Exclude()
  unwantedProperty?: never;
}
export class SearchSchoolDTO extends CommonSearchDTO {
  @IsOptional()
  @IsString()
  @Expose()
  schoolName: string;
}
