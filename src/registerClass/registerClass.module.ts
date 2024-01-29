import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { RegisterClassController } from "./resgisterClass.controller";
import { ResgisterSubjectClassService } from "./registerClass.Service";
import { ResgisterClassEntity } from "./registerClass.entity";

@Module({
  imports: [MikroOrmModule.forFeature([ResgisterClassEntity])],
  controllers: [RegisterClassController],
  providers: [ResgisterSubjectClassService],
})
export class RegisterClassModule {}
