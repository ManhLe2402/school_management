import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { SubjectEntity } from "./subject.entity";
import { SubjectController } from "./subject.controller";
import { SubjectService } from "./subject.service";

@Module({
  imports: [MikroOrmModule.forFeature([SubjectEntity])],
  controllers: [SubjectController],
  providers: [SubjectService],
})
export class SubjectModule {}
