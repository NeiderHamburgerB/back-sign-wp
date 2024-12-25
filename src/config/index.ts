import { databaseConfig } from './database';

export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  microservice_name: process.env.MICRO_NAME || 'micro',
  environment: process.env.ENVIRONMENT || 'DEV',
  database: databaseConfig(),
  endpoint_secret: process.env.ENDPOINT_SECRET,
});
