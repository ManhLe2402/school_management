import { Expose } from "class-transformer";
import { IsDate, IsOptional, IsUUID } from "class-validator";

export class CommonDTO {
  @IsUUID()
  @Expose({ toClassOnly: true })
  id: string;

  @IsDate()
  @Expose({ toClassOnly: true })
  createAt: Date;

  @Expose()
  @IsDate()
  updateAt: Date;

  @IsDate()
  @Expose({ toClassOnly: true })
  delete: Date;
}

export class PaginationDTO {
  @IsOptional()
  @Expose()
  page: number;

  @IsOptional()
  @Expose()
  pageSize: number;
}
export class CommonSearchDTO extends PaginationDTO {
  @Expose()
  @IsOptional()
  @IsUUID()
  id: string;
}
