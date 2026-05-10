/**
 * Configuration keys used in the application.
 */
export enum ConfigKey {
    // DATABASE ENV
    DB_TYPE = 'DB_TYPE',
    DB_HOST = 'DB_HOST',
    DB_PORT = 'DB_PORT',
    DB_USER = 'DB_USER',
    DB_PASSWORD = 'DB_PASSWORD',
    DB_DATABASE = 'DB_DATABASE',
    
    APP_BASE_URL = "APP_BASE_URL",
}

/**
 * Minimal configuration keys that are required for the application to run.
 */
export const configMinimalKeys: ConfigKey[] = Object.values(ConfigKey);
