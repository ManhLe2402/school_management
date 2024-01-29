import { MikroOrmModule } from "@mikro-orm/nestjs";
import { Module } from "@nestjs/common";
import { SchoolEntity } from "./school.entity";
import { SchoolController} from "./school.controller";
import { SchoolService} from "./school.service";

@Module({
  imports: [MikroOrmModule.forFeature([SchoolEntity])],
  controllers: [SchoolController],
  providers: [SchoolService],
})
export class SchoolModule {}
