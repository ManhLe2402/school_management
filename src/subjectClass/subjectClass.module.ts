import { Module } from "@nestjs/common";
import { SubjectClassEntity } from "./subjectClass.entity";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { SubjectClassService } from "./subjectClass.service";
import { SubjectClassController } from "./subjectClass.controller";

@Module({
  imports: [MikroOrmModule.forFeature([SubjectClassEntity])],
  controllers: [SubjectClassController],
  providers: [SubjectClassService],
})
export class SubjectClassModule {}
