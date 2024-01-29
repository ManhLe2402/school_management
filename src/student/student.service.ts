import { EntityManager, wrap } from "@mikro-orm/core";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {
  CreateStudentDTO,
  SearchStudentDTO,
  UpdateStudentDTO,
} from "./student.dto";
import { ISuccessResponse } from "src/common/response/success.response";
import { v4 as uuid } from "uuid";
import { StudentEntity } from "./student.entity";
import { SearchTeacherDTO } from "src/teacher/teacher.dto";
import { SchoolEntity } from "src/school/school.entity";
@Injectable()
export class StudentService {
  constructor(private readonly em: EntityManager) {}
  checkDependency = async (
    input: CreateStudentDTO | UpdateStudentDTO
  ): Promise<void> => {
    const checkSchoolExist = await this.em.findOne(SchoolEntity, {
      id: input.schoolId,
    });
    if (!checkSchoolExist) {
      throw new HttpException("School Not Exist", HttpStatus.NOT_FOUND);
    }
  };
  async create(student: CreateStudentDTO): Promise<CreateStudentDTO> {
    const id = uuid();
    await this.checkDependency(student);
    const newStudent = this.em.create(StudentEntity, { id, ...student });
    await this.em.persistAndFlush(newStudent);
    return student;
  }
  async find(searchStudent: SearchStudentDTO) {
    const {
      page = 1,
      pageSize = 30,
      fullName,
      id,
      enrollmentStatus,
      level,
    } = searchStudent;
    const conditionSearch = {
      ...(id ? { id } : {}),
      ...(enrollmentStatus ? { enrollmentStatus } : {}),
      ...(level ? { level } : {}),
    };
    const studentList = await this.em.findAndCount(
      StudentEntity,
      {
        ...conditionSearch,
        ...(fullName
          ? {
              $or: [
                { lastName: { $like: `%${fullName}%` } },
                { firstName: { $like: `%${fullName}%` } },
              ],
            }
          : {}),
      },
      { limit: pageSize, offset: (page - 1) * pageSize }
    );

    return studentList;
  }

  async findOne(id: uuid) {
    const studentRecord = await this.em.findOne(StudentEntity, id);
    if (!studentRecord) {
      throw new HttpException("Student Not Found", HttpStatus.NOT_FOUND);
    }
    return studentRecord;
  }

  async update(updateStudent: UpdateStudentDTO): Promise<UpdateStudentDTO> {
    const studentRecord = await this.em.findOne(StudentEntity, {
      id: updateStudent.id,
    });
    if (!studentRecord) {
      throw new HttpException("Student Not Found", HttpStatus.NOT_FOUND);
    }
    await this.checkDependency(updateStudent);
    wrap(studentRecord).assign(updateStudent);
    await this.em.persistAndFlush(studentRecord);
    return updateStudent;
  }
  async delete(id: uuid) {
    const studentRecord = await this.em.findOne(StudentEntity, id);

    if (!studentRecord) {
      throw new HttpException("Student Not Found", HttpStatus.NOT_FOUND);
    }
    await this.em.removeAndFlush(studentRecord);
    return studentRecord;
  }
}
