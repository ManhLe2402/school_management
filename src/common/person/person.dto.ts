import {
  IsDate,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  isNotEmpty,
} from "class-validator";
import { Expose } from "class-transformer";

export class CreatePersonDTO {
  @IsString()
  @IsNotEmpty()
  @Expose()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  lastName!: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  address!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  @IsIn(["male", "female"])
  gender: string;

  @IsString()
  @IsNotEmpty()
  @Expose()
  dateOfBirth: Date;

  @IsNotEmpty()
  @Length(10)
  @Expose()
  phone: string;

  @IsEmail()
  @Expose()
  @IsNotEmpty()
  email: string = null;
}
