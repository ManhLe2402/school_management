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
import { StudentService } from "./student.service";
import {
  CreateStudentDTO,
  GetStudentDTO,
  SearchStudentDTO,
  UpdateStudentDTO,
} from "./student.dto";
import { ISuccessResponse } from "src/common/response/success.response";
import { plainToClass } from "class-transformer";
import { UuidType } from "@mikro-orm/core";

@Controller("student")
export class StudentController {
  constructor(private readonly studentService: StudentService) {}
  @Post()
  async create(
    @Body() student: CreateStudentDTO
  ): Promise<ISuccessResponse<CreateStudentDTO>> {
    const data = await this.studentService.create(student);
    return { status: "Create Success", data };
  }
  @Get()
  async find(
    @Query() searchStudent: SearchStudentDTO
  ): Promise<
    ISuccessResponse<{ count: number; studentList: GetStudentDTO[] }>
  > {
    const studentRecords = await this.studentService.find(searchStudent);
    let studentList: GetStudentDTO[] = [];
    if (studentRecords[0]) {
      studentList = studentRecords[0].map((item) =>
        plainToClass(GetStudentDTO, item, { excludeExtraneousValues: true })
      );
    }
    return {
      status: "Get Student List Successfully",
      data: { count: studentRecords[1], studentList },
    };
  }

  @Get(":id")
  async findOne(
    @Param("id") id: UuidType
  ): Promise<ISuccessResponse<GetStudentDTO>> {
    const studentRecord = await this.studentService.findOne(id);
    const data = plainToClass(GetStudentDTO, studentRecord, {
      excludeExtraneousValues: true,
    });
    return { status: "Get Detail Student Successfully", data };
  }
  @Put()
  async update(
    @Body() updateStudent: UpdateStudentDTO
  ): Promise<ISuccessResponse<GetStudentDTO>> {
    const newStudent = await this.studentService.update(updateStudent);
    const data = plainToClass(GetStudentDTO, newStudent, {
      excludeExtraneousValues: true,
    });
    return { status: "Update Successfully", data };
  }
  @Delete(":id")
  async delete(@Param("id") id: UuidType): Promise<ISuccessResponse<string>> {
    await this.studentService.delete(id);

    return {
      status: "Delete Successfully",
      data: `Deleted the student ID = ${id}`,
    };
  }
}
