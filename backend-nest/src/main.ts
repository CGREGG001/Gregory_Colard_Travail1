import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { swaggerConfiguration } from '@core/documentation';
import { HttpExceptionFilter } from '@core/filters/http-exception.filter';
import { addTransactionalDataSource, initializeTransactionalContext } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { ValidationPipe } from '@nestjs/common';
import { exceptionFactory } from '@core/exceptions/validation/validation-exception-factory';

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
  
  // Swagger configuration
  swaggerConfiguration.config(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
