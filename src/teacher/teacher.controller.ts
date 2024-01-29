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
import { TeacherService } from "./teacher.service";
import {
  CreateTeacherDTO,
  GetTeacherDTO,
  SearchTeacherDTO,
  UpdateTeacherDTO,
} from "./teacher.dto";
import { ISuccessResponse } from "src/common/response/success.response";

import { plainToClass, plainToInstance } from "class-transformer";
import { UuidType } from "@mikro-orm/core";

@Controller("teacher")
export class TeacherController {
  constructor(private readonly teacherService: TeacherService) {}
  @Post()
  async create(
    @Body() teacher: CreateTeacherDTO
  ): Promise<ISuccessResponse<CreateTeacherDTO>> {
    const data = await this.teacherService.create(teacher);
    return { status: "Create succsess", data: data };
  }
  @Get()
  async find(
    @Query() searchTeacher: SearchTeacherDTO
  ): Promise<
    ISuccessResponse<{ count: number; teacherList: GetTeacherDTO[] }>
  > {
    const dataFind = await this.teacherService.find(searchTeacher);
    let teacherList: GetTeacherDTO[] = [];
    if (dataFind[0]) {
      teacherList = dataFind[0].map((item) =>
        plainToClass(GetTeacherDTO, item, { excludeExtraneousValues: true })
      );
    }
    return {
      status: "Get Data SuccessFully",
      data: { count: dataFind[1], teacherList },
    };
  }
  @Get(":id")
  async findOne(
    @Param("id") id: UuidType
  ): Promise<ISuccessResponse<GetTeacherDTO>> {
    const teacherRecord = await this.teacherService.findOne(id);
    const data = plainToClass(GetTeacherDTO, teacherRecord, {
      excludeExtraneousValues: true,
    });

    return { status: "Get Detail Successfuly", data };
  }
  @Put()
  async update(
    @Body() newTeacher: UpdateTeacherDTO
  ): Promise<ISuccessResponse<UpdateTeacherDTO>> {
    return await this.teacherService.update(newTeacher);
  }

  @Delete(":id")
  async delelte(@Param("id") id: UuidType): Promise<ISuccessResponse<string>> {
    await this.teacherService.delete(id);
    return {
      status: "Delete Successfully",
      data: `Deleted the Teacher Id= ${id}`,
    };
  }
}
