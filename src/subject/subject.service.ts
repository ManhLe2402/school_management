import { EntityManager, wrap } from "@mikro-orm/core";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {
  CreateSubjectDTO,
  GetSubjectDTO,
  SearchSubjectDTO,
  UpdateSubjectDTO,
} from "./subject.dto";
import { SubjectEntity } from "./subject.entity";
import { v4 as uuid } from "uuid";

@Injectable()
export class SubjectService {
  constructor(private readonly em: EntityManager) {}
  async create(subject: CreateSubjectDTO): Promise<CreateSubjectDTO> {
    const id = uuid();
    const newSubject = this.em.create(SubjectEntity, { id, ...subject });
    await this.em.persistAndFlush(newSubject);
    return newSubject;
  }

  async find(searchSubject: SearchSubjectDTO) {
    try {
      const { subjectName, id, page = 1, pageSize = 30 } = searchSubject;
      const data = await this.em.findAndCount(
        SubjectEntity,
        {
          ...(id ? { id } : {}),
          ...(subjectName
            ? { subjectName: { $like: `%${subjectName}%` } }
            : {}),
        },
        { limit: pageSize, offset: (page - 1) * pageSize }
      );
      return data;
    } catch (error) {
      console.log("findAllSubjectService", error);
    }
  }
  async findOne(id: uuid): Promise<GetSubjectDTO> {
    const subjectRecord = await this.em.findOne(SubjectEntity, id);
    if (!subjectRecord) {
      throw new HttpException("Subject Not Found", HttpStatus.NOT_FOUND);
    }
    return subjectRecord;
  }

  async update(newSubject: UpdateSubjectDTO): Promise<UpdateSubjectDTO> {
    const subjectRecord = await this.em.findOne(SubjectEntity, {
      id: newSubject.id,
    });
    if (!subjectRecord) {
      throw new HttpException("Subject Not Found", HttpStatus.NOT_FOUND);
    }
    wrap(subjectRecord).assign(newSubject);
    await this.em.persistAndFlush(subjectRecord);
    return newSubject;
  }

  async delete(id: uuid): Promise<GetSubjectDTO> {
    const subjectRecord = await this.em.findOne(SubjectEntity, id);
    if (!subjectRecord) {
      throw new HttpException("Subject Not Found", HttpStatus.NOT_FOUND);
    }
    await this.em.removeAndFlush(subjectRecord);
    return subjectRecord;
  }
}
