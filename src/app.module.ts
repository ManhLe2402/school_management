import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { SchoolModule } from "./school/school.module";
import { TeacherModule } from "./teacher/teacher.module";
import { SubjectModule } from "./subject/subject.module";
import { SubjectClassModule } from "./subjectClass/subjectClass.module";
import { StudentModule } from "./student/student.module";
import { RegisterClassModule } from "./registerClass/registerClass.module";

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      useFactory: async () => {
        return {
          driver: PostgreSqlDriver,
          // clientUrl: "postgres://postgres:ManhTH2402@localhost:5432/postgres",
          clientUrl:
            "postgres://manhle:manhle123@mapstudy.edu.vn:5432/mapstudy_train",
          autoLoadEntities: true,
        };
      },
    }),
    SchoolModule,
    TeacherModule,
    SubjectModule,
    SubjectClassModule,
    StudentModule,
    RegisterClassModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
