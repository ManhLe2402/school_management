import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import {
  CreateRegisterClassDTO,
  GetRegisterClassDTO,
  SearchRegisterClassDTO,
  UpdateRegisterClassDTO,
} from "./registerClass.dto";
import { ISuccessResponse } from "src/common/response/success.response";
import { ResgisterSubjectClassService } from "./registerClass.Service";

import { UuidType } from "@mikro-orm/core";
import { plainToClass } from "class-transformer";

@Controller("register_class")
export class RegisterClassController {
  constructor(
    private readonly registerClassService: ResgisterSubjectClassService
  ) {}
  @Post()
  async create(
    @Body() registerClassForm: CreateRegisterClassDTO
  ): Promise<ISuccessResponse<CreateRegisterClassDTO>> {
    return await this.registerClassService.create(registerClassForm);
  }
  @Get()
  async find(@Query() formSearch: SearchRegisterClassDTO): Promise<
    ISuccessResponse<{
      count: number;
      registerClassList: GetRegisterClassDTO[];
    }>
  > {
    const registerClassRecords =
      await this.registerClassService.find(formSearch);
    let registerClassList: GetRegisterClassDTO[] = [];
    if (registerClassRecords[0]) {
      registerClassList = registerClassRecords[0].map((item) =>
        plainToClass(GetRegisterClassDTO, item, {
          excludeExtraneousValues: true,
        })
      );
    }
    return {
      status: "Get Register Class List Successfully",
      data: { count: registerClassRecords[1], registerClassList },
    };
  }

  @Put()
  async update(
    @Body() updateRegisterClass: UpdateRegisterClassDTO
  ): Promise<ISuccessResponse<CreateRegisterClassDTO>> {
    return await this.registerClassService.update(updateRegisterClass);
  }
  @Delete("id")
  async delete(@Param("id") id: UuidType): Promise<ISuccessResponse<string>> {
    return this.registerClassService.delete(id);
  }
}
