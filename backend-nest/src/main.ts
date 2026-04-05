import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfiguration } from '@core/documentation';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger
  swaggerConfiguration.config(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
