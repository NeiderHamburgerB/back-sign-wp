import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import * as compression from 'compression';
import { Logger } from '@nestjs/common';
import { json } from 'express';
import * as morgan from 'morgan';
import { AppModule } from './app.module';
import { setSwaggerConfig } from './app.swagger';
import { constants } from './common';

async function bootstrap() {
  // Create the Nest application
  const app = await NestFactory.create(AppModule, { cors: true });

  //app.useGlobalFilters(new HttpExceptionFilter('wompi-backend'));

  // Set prefix
  app.setGlobalPrefix(`api/${constants.MICRO_NAME}`.toLowerCase());

  // Logger
  const logger = new Logger('NestApplication');

  // Middlewares
  app.use(helmet());
  app.use(compression());
  app.use(json({ limit: '5mb' }));
  app.use(morgan('dev'));

  // Swagger configuration
  if (constants.NODE_ENENVIRONMENTV == 'DEVELOPMENT') {
    setSwaggerConfig(app);
  }

  // Start the application
  await app.listen(constants.PORT, () =>
    logger.log(`Server is running on port ${constants.PORT}`),
  );
}
bootstrap();


