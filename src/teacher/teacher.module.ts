import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { TeacherEntity } from "./teacher.entity";
import { TeacherController } from "./teacher.controller";
import { TeacherService } from "./teacher.service";

@Module({
  imports: [MikroOrmModule.forFeature([TeacherEntity])],
  controllers: [TeacherController],
  providers: [TeacherService],
})
export class TeacherModule {}
