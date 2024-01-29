import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { MikroOrmModule } from "@mikro-orm/nestjs";
import { PostgreSqlDriver } from "@mikro-orm/postgresql";
import { ValidationPipe } from "@nestjs/common";
import { MikroORM } from "@mikro-orm/core";
import * as dotenv from "dotenv";
async function bootstrap() {
  const PORT = 8080;
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
  const updateDump = await app
    .get(MikroORM)
    .getSchemaGenerator()
    .getUpdateSchemaSQL({
      wrap: false,
      safe: true,
    });
  console.log("\n\nSTART UPDATE \n\n", updateDump, "\n\nEND UPDATE\n\n");
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { strategy: "excludeAll" },
    })
  );
  await app.listen(PORT, () => console.log(`App run in ${PORT}`));
}
bootstrap();
