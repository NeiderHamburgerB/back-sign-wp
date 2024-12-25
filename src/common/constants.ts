// Libraries
import { config } from 'dotenv';

// Dot env config
config();

export default {
  NODE_ENENVIRONMENTV: process.env.ENVIRONMENT || 'DEVELOPMENT',
  PORT: process.env.PORT || 3000,
  MICRO_NAME: process.env.MICRO_NAME || 'main',
  // DB CONFIG postgres default
  POSTGRES_HOST: process.env.POSTGRES_HOST || 'localhost',
  POSTGRES_PORT: Number(process.env.POSTGRES_PORT) || 5435,
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE || 'wompiDev',
  POSTGRES_USER: process.env.POSTGRES_USER || 'root',
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD || 'root',
  // WOMPI CONFIG
  WOMPI_BASE_URL: process.env.WOMPI_BASE_URL || 'https://sandbox.wompi.co/v1',
  WOMPI_PUBLIC_KEY : process.env.WOMPI_PUBLIC_KEY || '',
  WOMPI_SECRET_KEY : process.env.WOMPI_SECRET_KEY || '',
};
