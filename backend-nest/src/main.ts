import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfiguration } from '@core/documentation';
import { HttpExceptionFilter } from '@core/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Filter
  app.useGlobalFilters(new HttpExceptionFilter());
  
  // Swagger
  swaggerConfiguration.config(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
