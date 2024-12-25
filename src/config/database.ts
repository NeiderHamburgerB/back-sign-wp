import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const databaseConfig = (): PostgresConnectionOptions => ({
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT) || 5435,
  username: process.env.POSTGRES_USER || 'root',
  password: process.env.POSTGRES_PASSWORD || 'root',
  database: process.env.POSTGRES_DATABASE || 'wompiDev',
  ssl: true, 
  extra: {
    ssl: {
      rejectUnauthorized: false, 
    },
  },
  entities: [__dirname + '/../modules/**/entities/*.entity{.ts,.js}'],
  synchronize: true,
  migrations: [__dirname + '../migrations/**/*.{.ts,.js}'],
  migrationsTableName: 'migrations_typeorm',
});

export default databaseConfig();
