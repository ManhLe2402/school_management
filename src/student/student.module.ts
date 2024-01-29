import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { StudentEntity } from "./student.entity";
import { StudentController } from "./student.controller";
import { StudentService } from "./student.service";

@Module({
  imports: [MikroOrmModule.forFeature([StudentEntity])],
  controllers: [StudentController],
  providers: [StudentService],
})
export class StudentModule {}
