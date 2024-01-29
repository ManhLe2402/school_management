import { EntityManager, wrap } from "@mikro-orm/core";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import {
  CreateRegisterClassDTO,
  SearchRegisterClassDTO,
  UpdateRegisterClassDTO,
} from "./registerClass.dto";
import { v4 as uuid } from "uuid";
import { SubjectClassEntity } from "src/subjectClass/subjectClass.entity";
import { StudentEntity } from "src/student/student.entity";
import { ResgisterClassEntity } from "./registerClass.entity";
import { ISuccessResponse } from "src/common/response/success.response";
import { SubjectEntity } from "src/subject/subject.entity";

@Injectable()
export class ResgisterSubjectClassService {
  constructor(private readonly em: EntityManager) {}
  async conditionRegister(resgiterClassForm) {
    const now = new Date().getTime();

    const inforSubjectClass = await this.em.findOne(
      SubjectClassEntity,
      {
        id: resgiterClassForm.subjectClassId,
      },
      { populate: ["subjectId"] }
    );
    if (!inforSubjectClass) {
      throw new HttpException("Subject Class Not Found", HttpStatus.NOT_FOUND);
    }
    if (new Date(inforSubjectClass.startAt).getTime() < now) {
      throw new HttpException("Expired Registration", HttpStatus.BAD_REQUEST);
    }
    if (inforSubjectClass.classStatus === "unactive") {
      throw new HttpException("Canceled Class ", HttpStatus.BAD_REQUEST);
    }
    const inforStudent = await this.em.findOne(StudentEntity, {
      id: resgiterClassForm.studentId,
    });
    if (inforStudent.enrollmentStatus !== "active") {
      throw new HttpException(
        "Student Cannot RegisterClass",
        HttpStatus.BAD_REQUEST
      );
    }
    if (!inforStudent) {
      throw new HttpException("Student Not Found", HttpStatus.NOT_FOUND);
    }
    const registerList = await this.em.find(
      ResgisterClassEntity,
      {
        subjectClassId: resgiterClassForm.subjectClassId,
      },
      { disableIdentityMap: true }
    );

    if (registerList.length >= 200) {
      throw new HttpException("Class Fully", HttpStatus.BAD_REQUEST);
    }
    const checkLevel = () => {
      if (
        typeof inforSubjectClass.subjectId === "object" &&
        inforSubjectClass.subjectId !== null
      ) {
        if (
          (inforSubjectClass.subjectId as SubjectEntity)?.level !==
          inforStudent.level
        )
          return true;
        return false;
      }
      return false;
    };
    if (inforStudent.level <= 12 && checkLevel()) {
      throw new HttpException(
        "Can only register the same level",
        HttpStatus.BAD_REQUEST
      );
    }
    if (
      registerList.some((item) => {
        if (typeof item.studentId === "object" && item.studentId !== null) {
          if (
            (item.studentId as StudentEntity)?.id ===
            resgiterClassForm.studentId
          )
            return true;
          return false;
        } else {
          return false;
        }
      })
    ) {
      throw new HttpException(
        "Student Have Registered",
        HttpStatus.BAD_REQUEST
      );
    }
  }
  async create(
    resgiterClassForm: CreateRegisterClassDTO
  ): Promise<ISuccessResponse<CreateRegisterClassDTO>> {
    const id = uuid();
    /*     const now = new Date().getTime();
    const inforSubjectClass = await this.em.findOne(
      SubjectClassEntity,
      {
        id: resgiterClassForm.subjectClassId,
      },
      { populate: ["subjectId"] }
    );

    const inforStudent = await this.em.findOne(StudentEntity, {
      id: resgiterClassForm.studentId,
    });
    const registerList = await this.em.find(
      ResgisterClassEntity,
      {
        subjectClassId: resgiterClassForm.subjectClassId,
      },
      { disableIdentityMap: true }
    );
    if (!inforSubjectClass) {
      throw new HttpException("Subject Class Not Found", HttpStatus.NOT_FOUND);
    }
    if (!inforStudent) {
      throw new HttpException("Student Not Found", HttpStatus.NOT_FOUND);
    }
    if (new Date(inforSubjectClass.startAt).getTime() < now) {
      throw new HttpException("Expired Registration", HttpStatus.BAD_REQUEST);
    }
    if (inforSubjectClass.classStatus === "unactive") {
      throw new HttpException("Canceled Class ", HttpStatus.BAD_REQUEST);
    }
    if (inforStudent.enrollmentStatus !== "active") {
      throw new HttpException(
        "Student Cannot RegisterClass",
        HttpStatus.BAD_REQUEST
      );
    }
    if (registerList.length >= 200) {
      throw new HttpException("Class Fully", HttpStatus.BAD_REQUEST);
    }
    const checkLevel = () => {
      if (
        typeof inforSubjectClass.subjectId === "object" &&
        inforSubjectClass.subjectId !== null
      ) {
        if (
          (inforSubjectClass.subjectId as SubjectEntity)?.level !==
          inforStudent.level
        )
          return true;
        return false;
      }
      return false;
    };
    if (inforStudent.level <= 12 && checkLevel()) {
      throw new HttpException(
        "Can only register the same level",
        HttpStatus.BAD_REQUEST
      );
    }
    if (
      registerList.some((item) => {
        if (typeof item.studentId === "object" && item.studentId !== null) {
          if (
            (item.studentId as StudentEntity)?.id ===
            resgiterClassForm.studentId
          )
            return true;
          return false;
        } else {
          return false;
        }
      })
    ) {
      throw new HttpException(
        "Student Have Registered",
        HttpStatus.BAD_REQUEST
      );
    } */
    await this.conditionRegister(resgiterClassForm);

    const newRegisterSubjectClassForm = this.em.create(ResgisterClassEntity, {
      id,
      ...resgiterClassForm,
    });

    const data = await this.em.persistAndFlush(newRegisterSubjectClassForm);
    return { status: "Register Successfully", data: resgiterClassForm };
  }

  async find(formSearch: SearchRegisterClassDTO) {
    try {
      const {
        id,
        studentId,
        subjectClassId,
        page = 1,
        pageSize = 30,
      } = formSearch;
      const conditionSearch = {
        ...(id ? { id } : {}),
        ...(studentId ? { studentId } : {}),
        ...(subjectClassId ? { subjectClassId } : {}),
      };
      const data = await this.em.findAndCount(
        ResgisterClassEntity,
        conditionSearch,
        {
          populate: [
            "studentId",
            "subjectClassId.teacherId",
            "subjectClassId.subjectId",
          ],
          limit: pageSize,
          offset: (page - 1) * pageSize,
        }
      );

      return data;
    } catch (error) {
      throw new HttpException("Find Fail", HttpStatus.BAD_REQUEST);
    }
  }

  async update(
    updateRegisterClass: UpdateRegisterClassDTO
  ): Promise<ISuccessResponse<UpdateRegisterClassDTO>> {
    const registerClassRecord = await this.em.findOne(
      ResgisterClassEntity,
      {
        id: updateRegisterClass.id,
      },
      { disableIdentityMap: true }
    );
    if (!registerClassRecord) {
      throw new HttpException("Record Not Found", HttpStatus.NOT_FOUND);
    }
    await this.conditionRegister(updateRegisterClass);
    wrap(registerClassRecord).assign(updateRegisterClass);
    await this.em.persistAndFlush(registerClassRecord);
    return { status: "Update Success Fully", data: updateRegisterClass };
  }
  async delete(id: uuid): Promise<ISuccessResponse<string>> {
    const registerClassRecord = await this.em.findOne(ResgisterClassEntity, id);
    if (!registerClassRecord) {
      throw new HttpException(
        "Register Class Record Not Found",
        HttpStatus.NOT_FOUND
      );
    }
    await this.em.removeAndFlush(registerClassRecord);
    return {
      status: "Delete Successfuly",
      data: `Delete the record with ID = ${id.id}`,
    };
  }
}
