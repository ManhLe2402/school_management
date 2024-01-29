import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { SubjectClassService } from "./subjectClass.service";
import {
  CreateSubjectClassDTO,
  GetSubjectClassDTO,
  SearchSubjectClassDTO,
  UpdateSubjectClassDTO,
} from "./subjectClass.dto";
import { EntityManager, UuidType } from "@mikro-orm/core";
import { ISuccessResponse } from "src/common/response/success.response";
import { plainToClass } from "class-transformer";
import { GetTeacherDTO } from "src/teacher/teacher.dto";

@Controller("subjectclass")
export class SubjectClassController {
  constructor(private readonly subjectClassService: SubjectClassService) {}
  @Post()
  async create(
    @Body() subjectClass: CreateSubjectClassDTO
  ): Promise<ISuccessResponse<CreateSubjectClassDTO>> {
    const condition =
      new Date(subjectClass.startAt) > new Date(subjectClass.endAt);
    if (condition) {
      throw new HttpException(
        "startAt must be smaller than endAt",
        HttpStatus.BAD_REQUEST
      );
    }
    const data = await this.subjectClassService.create(subjectClass);
    return {
      status: "Create success",
      data,
    };
  }
  @Get()
  async find(
    @Query() searchSubjectClass: SearchSubjectClassDTO
  ): Promise<
    ISuccessResponse<{ count: number; listSubjectClass: GetSubjectClassDTO[] }>
  > {
    const dataRecords = await this.subjectClassService.find(searchSubjectClass);
    let listSubjectClass: GetSubjectClassDTO[] = [];
    if (dataRecords[0]) {
      listSubjectClass = dataRecords[0].map((item) =>
        plainToClass(GetSubjectClassDTO, item, {
          excludeExtraneousValues: true,
        })
      );
    }
    return {
      status: "Get List Subject Class Successfully",
      data: { count: dataRecords[1], listSubjectClass },
    };
  }

  @Get(":id")
  async findOne(
    @Param("id") id: UuidType
  ): Promise<ISuccessResponse<GetSubjectClassDTO>> {
    const subjectClassRecord = await this.subjectClassService.findOne(id);
    const data = await plainToClass(GetSubjectClassDTO, subjectClassRecord, {
      excludeExtraneousValues: true,
    });
    return { status: "Get Detail Subject Class Successfully", data };
  }
  @Put()
  async update(
    @Body() newSubjectClass: UpdateSubjectClassDTO
  ): Promise<ISuccessResponse<UpdateSubjectClassDTO>> {
    const condition =
      new Date(newSubjectClass.startAt) > new Date(newSubjectClass.endAt);
    if (condition) {
      throw new HttpException(
        "startAt must be smaller than endAt",
        HttpStatus.BAD_REQUEST
      );
    }

    const data = await this.subjectClassService.update(newSubjectClass);
    return { status: "Update success", data };
  }
  @Delete(":id")
  async delete(@Param("id") id: UuidType): Promise<ISuccessResponse<string>> {
    try {
      const data = await this.subjectClassService.delete(id);
      return { status: "Delete Success", data };
    } catch (error) {
      throw new HttpException("Delete Fail", HttpStatus.BAD_REQUEST);
    }
  }
}
