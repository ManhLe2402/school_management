import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from "@nestjs/common";
import { SubjectService } from "./subject.service";
import {
  CreateSubjectDTO,
  GetSubjectDTO,
  SearchSubjectDTO,
  UpdateSubjectDTO,
} from "./subject.dto";
import { ISuccessResponse } from "src/common/response/success.response";

import { plainToClass } from "class-transformer";
import { UuidType } from "@mikro-orm/core";

@Controller("subject")
export class SubjectController {
  constructor(private readonly subjectService: SubjectService) {}
  @Post()
  async create(
    @Body() subject: CreateSubjectDTO
  ): Promise<ISuccessResponse<CreateSubjectDTO>> {
    const data = await this.subjectService.create(subject);
    return { status: "Create success", data: subject };
  }

  @Get()
  async find(
    @Query() searchSubject: SearchSubjectDTO
  ): Promise<
    ISuccessResponse<{ count: number; subjectList: UpdateSubjectDTO[] }>
  > {
    const dataFind = await this.subjectService.find(searchSubject);
    let subjectList: UpdateSubjectDTO[] = [];
    if (dataFind[0]) {
      subjectList = dataFind[0].map((item) =>
        plainToClass(UpdateSubjectDTO, item, { excludeExtraneousValues: true })
      );
    }
    return {
      status: "Get Successfully",
      data: { count: dataFind[1], subjectList },
    };
  }
  @Get(":id")
  async findOne(
    @Param("id") id: UuidType
  ): Promise<ISuccessResponse<GetSubjectDTO>> {
    const subjectRecord = await this.subjectService.findOne(id);
    const data = await plainToClass(GetSubjectDTO, subjectRecord, {
      excludeExtraneousValues: true,
    });
    return { status: "Get Detail Subject Successfully", data };
  }
  @Put()
  async update(
    @Body() updateSubject: UpdateSubjectDTO
  ): Promise<ISuccessResponse<UpdateSubjectDTO>> {
    const subjectRecord = await this.subjectService.update(updateSubject);
    const data = plainToClass(GetSubjectDTO, subjectRecord, {
      excludeExtraneousValues: true,
    });
    return { status: "Update Subject Successfully", data };
  }
  @Delete(":id")
  async delete(@Param("id") id: UuidType): Promise<ISuccessResponse<string>> {
    const subjectRecord = await this.subjectService.delete(id);
    return {
      status: "Delete Subject Successfully",
      data: `Deleted the subject ID = ${id}`,
    };
  }
}
