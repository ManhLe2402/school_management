import {
  HttpException,
  HttpStatus,
  Injectable,
  ParseIntPipe,
} from "@nestjs/common";
import {
  CreateSubjectClassDTO,
  SearchSubjectClassDTO,
  UpdateSubjectClassDTO,
} from "./subjectClass.dto";
import { ISuccessResponse } from "src/common/response/success.response";
import { v4 as uuidv4 } from "uuid";
import { EntityManager, wrap } from "@mikro-orm/core";
import { SubjectClassEntity } from "./subjectClass.entity";
import { TeacherEntity } from "src/teacher/teacher.entity";
import { SubjectEntity } from "src/subject/subject.entity";

@Injectable()
export class SubjectClassService {
  constructor(private readonly em: EntityManager) {}
  checkDependency = async (
    input: CreateSubjectClassDTO | UpdateSubjectClassDTO
  ): Promise<void> => {
    const checkTeacherExist = await this.em.findOne(TeacherEntity, {
      id: input.teacherId,
    });
    if (!checkTeacherExist) {
      throw new HttpException("Teacher Not Exist", HttpStatus.NOT_FOUND);
    }
    const checkSubjectExist = await this.em.findOne(SubjectEntity, {
      id: input.subjectId,
    });
    if (!checkSubjectExist) {
      throw new HttpException("Subject Not Exist", HttpStatus.NOT_FOUND);
    }
  };
  async create(
    subjectClass: CreateSubjectClassDTO
  ): Promise<CreateSubjectClassDTO> {
    const id = uuidv4();
    await this.checkDependency(subjectClass);
    const newSubjectClass = this.em.create(SubjectClassEntity, {
      id,
      ...subjectClass,
    });
    await this.em.persistAndFlush(newSubjectClass);
    return newSubjectClass;
  }

  async find(searchSubjectClass: SearchSubjectClassDTO) {
    try {
      const { page, pageSize, id, teacherId, subjectId } = searchSubjectClass;
      const conditionSearch = {
        ...(id ? { id } : {}),
        ...(teacherId ? { teacherId } : {}),
        ...(subjectId ? { subjectId } : {}),
      };
      const data = await this.em.findAndCount(
        SubjectClassEntity,
        conditionSearch,
        {
          populate: ["subjectId", "teacherId"],
          limit: pageSize,
          offset: (page - 1) * pageSize,
        }
      );
      return data;
    } catch (error) {
      console.log("fetchDataWithPagination", error);
    }
  }
  async findOne(id: uuidv4) {
    const subjectClassRecord = await this.em.findOne(SubjectClassEntity, id, {
      populate: ["subjectId", "teacherId"],
    });
    if (!subjectClassRecord) {
      throw new HttpException("Subject Class Not Found", HttpStatus.NOT_FOUND);
    }
    return subjectClassRecord;
  }

  async update(newSubjectClass: UpdateSubjectClassDTO) {
    const subjectClassRecord = await this.em.findOne(
      SubjectClassEntity,
      newSubjectClass.id
    );
    if (!subjectClassRecord) {
      throw new HttpException("Subject Class Not Found", HttpStatus.NOT_FOUND);
    }
    await this.checkDependency(newSubjectClass);
    wrap(subjectClassRecord).assign(newSubjectClass);
    await this.em.persistAndFlush(subjectClassRecord);
    return newSubjectClass;
  }
  async delete(id: uuidv4) {
    try {
      const subjectClass = await this.em.findOneOrFail(SubjectClassEntity, id);
      await this.em.removeAndFlush(subjectClass);
      return `Delete item ID = ${id.id}`;
    } catch (error) {
      throw new HttpException("Delete Fail", HttpStatus.BAD_REQUEST);
    }
  }
}
