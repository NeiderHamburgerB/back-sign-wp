import { ApiResponseOptions } from '@nestjs/swagger';

const NewCustomerResponse: ApiResponseOptions = {
  status: 201,
  description: 'Cliente creado exitosamente',
  schema: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          firstName: {
            type: 'string',
            example: 'neeaa',
          },
          email: {
            type: 'string',
            example: 'aggggga@gmail.com',
          },
          id: {
            type: 'integer',
            example: 16,
          },
          createdAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-12-25T03:15:06.342Z',
          },
          updatedAt: {
            type: 'string',
            format: 'date-time',
            example: '2024-12-25T03:15:06.342Z',
          },
          deletedAt: {
            type: 'string',
            format: 'date-time',
            nullable: true,
            example: null,
          },
        },
      },
    },
  },
};

export { NewCustomerResponse };
