import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfiguration } from '@core/documentation';
import { HttpExceptionFilter } from '@core/filters/http-exception.filter';
import { addTransactionalDataSource, initializeTransactionalContext } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { ValidationPipe } from '@nestjs/common';
import { exceptionFactory } from '@core/exceptions/validation/validation-exception-factory';
import { ApiInterceptor } from '@core/interceptors/api.interceptor';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  // Initialize the CLS context to enable automatic transactions
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);

  // Register the DataSource so that @Transactional can open and close transactions
  const dataSource = app.get(DataSource);
  addTransactionalDataSource(dataSource);

  // Global DTO validation with custom exception formatting
  app.useGlobalPipes(
        new ValidationPipe({
            exceptionFactory,
        }),
    );

  // Global filter to standardize HTTP error responses
  app.useGlobalFilters(new HttpExceptionFilter());

  // Global interceptor
  app.useGlobalInterceptors(new ApiInterceptor());

  // Prefix
  app.setGlobalPrefix(process.env.APP_BASE_URL ?? 'api');

  // Swagger configuration
  swaggerConfiguration.config(app);

  /**
   * Enables automatic parsing of incoming cookies.
   *
   * Required for reading the HttpOnly refresh token sent by the client.
   * Without this middleware, NestJS cannot access `req.cookies`.
   */
  app.use(cookieParser());
  
  // Configures CORS to allow the Angular frontend to communicate with the API.
  app.enableCors({
  origin: 'http://localhost:4200',
  credentials: true,
});

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
