/**
 * TYPEORM CLI DATA SOURCE CONFIGURATION
 * * This file is EXCLUSIVELY used by the TypeORM CLI to manage migrations.
 * It is not used by the NestJS application at runtime.
 * * Usage: npm run migration:generate -- src/migrations/Name
 * Migrations folder: /src/migrations
 * Documentation: https://typeorm.io/migrations
 */
import { DataSource } from 'typeorm';
import { configManager } from '@core/config';
import { DataSourceOptions } from 'typeorm';

// We retrieve the config and cast it to DataSourceOptions
export const connectionSource = new DataSource(
    configManager.getTypeOrmConfig() as DataSourceOptions,
);

export default connectionSource;
