import { EntityManager, wrap } from "@mikro-orm/core";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { SchoolEntity } from "./school.entity";
import { v4 as uuidv4 } from "uuid";
import {
  CreateSchoolDTO,
  GetSchoolDTO,
  SearchSchoolDTO,
  UpdateSchoolDTO,
} from "./school.dto";
import { ISuccessResponse } from "src/common/response/success.response";
@Injectable()
export class SchoolService {
  constructor(private readonly em: EntityManager) {}
  async create(school: CreateSchoolDTO): Promise<CreateSchoolDTO> {
    const id = uuidv4();
    const newSchool = this.em.create(SchoolEntity, { id, ...school });
    await this.em.persistAndFlush(newSchool);
    return newSchool;
  }
  async findOne(id: uuidv4): Promise<GetSchoolDTO> {
    const schoolRecord = await this.em.findOne(SchoolEntity, id);
    if (!schoolRecord) {
      throw new HttpException("School Not Found", HttpStatus.NOT_FOUND);
    }
    return schoolRecord;
  }
  async find(searchSchool: SearchSchoolDTO) {
    const { page = 1, pageSize = 30, id, schoolName } = searchSchool;
    const schoolRecord = this.em.findAndCount(
      SchoolEntity,
      {
        ...(id ? { id } : {}),
        ...(schoolName ? { schoolName: { $like: `%${schoolName}%` } } : {}),
      },
      { limit: pageSize, offset: (page - 1) * pageSize }
    );
    return schoolRecord;
  }
  async update(newSchool: UpdateSchoolDTO): Promise<UpdateSchoolDTO> {
    const schoolRecord = await this.em.findOne(SchoolEntity, {
      id: newSchool.id,
    });
    if (!schoolRecord) {
      throw new HttpException("School Not Found", HttpStatus.NOT_FOUND);
    }
    wrap(schoolRecord).assign(newSchool);
    await this.em.persistAndFlush(schoolRecord);

    return newSchool;
  }
  async delete(id: uuidv4) /* : Promise<ISuccessResponse<string>>  */ {
    const schoolRecord = await this.em.findOne(SchoolEntity, id);
    if (!schoolRecord) {
      throw new HttpException("School Not Found", HttpStatus.NOT_FOUND);
    }
    await this.em.removeAndFlush(schoolRecord);
    return schoolRecord;
  }
}
