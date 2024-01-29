import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";

import { SchoolEntity } from "./school.entity";
import { SchoolService } from "./school.service";
import {
  CreateSchoolDTO,
  GetSchoolDTO,
  SearchSchoolDTO,
  UpdateSchoolDTO,
} from "./school.dto";
import { UuidType } from "@mikro-orm/core";
import { plainToClass, plainToInstance } from "class-transformer";
import { ISuccessResponse } from "src/common/response/success.response";

@Controller("school")
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}
  @Post()
  async create(
    @Body() school: CreateSchoolDTO
  ): Promise<{ status: string; data: CreateSchoolDTO }> {
    try {
      const data = await this.schoolService.create(school);
      return { status: "Create success", data: data };
    } catch (error) {
      throw new HttpException("Create Fail", HttpStatus.BAD_REQUEST);
    }
  }
  @Get(":id")
  async findOneSchool(
    @Param("id") id: UuidType
  ): Promise<ISuccessResponse<GetSchoolDTO>> {
    const school = await this.schoolService.findOne(id);
    const data = await plainToClass(GetSchoolDTO, school, {
      excludeExtraneousValues: true,
    });
    return { status: "Get Detail School Successfully", data };
  }
  @Get()
  async findList(
    @Query() searchSchool: SearchSchoolDTO
  ): Promise<ISuccessResponse<{ count: number; schoolList: GetSchoolDTO[] }>> {
    const findData = await this.schoolService.find(searchSchool);
    let schoolList: GetSchoolDTO[] = [];
    if (findData[0]) {
      schoolList = findData[0].map((item) =>
        plainToClass(GetSchoolDTO, item, { excludeExtraneousValues: true })
      );
    }
    return {
      status: "Get Data Successfully",
      data: { count: findData[1], schoolList },
    };
  }

  @Put()
  async update(
    @Body() updateSchool: UpdateSchoolDTO
  ): Promise<ISuccessResponse<UpdateSchoolDTO>> {
    const newRecord = await this.schoolService.update(updateSchool);
    const data = plainToClass(UpdateSchoolDTO, newRecord);
    return { status: "Update Successfully", data };
  }
  @Delete(":id")
  async delete(@Param("id") id: UuidType): Promise<ISuccessResponse<string>> {
    // return await this.schoolService.delete(id);
    await this.schoolService.delete(id);
    return {
      status: "Delete Successfully",
      data: `Delete the school ID= ${id}`,
    };
  }
}
