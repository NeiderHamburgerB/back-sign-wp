// Libraries
import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { constants } from './common';

// Set swagger configuration
export const setSwaggerConfig = (app: INestApplication) => {
  // Set name
  const config = new DocumentBuilder()
    .setTitle(`${constants.MICRO_NAME.toUpperCase()} API WOMPI`)
    .setDescription('Test API for Wompi')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(
    `api/${constants.MICRO_NAME}/docs`.toLowerCase(),
    app,
    document,
  );
};
