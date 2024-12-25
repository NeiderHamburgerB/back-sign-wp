import { ApiResponseOptions } from '@nestjs/swagger';

const GetAllProductsResponse: ApiResponseOptions = {
  status: 200,
  description: 'Lista de productos obtenida exitosamente',
  schema: {
    type: 'object',
    properties: {
      data: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 2,
            },
            name: {
              type: 'string',
              example: 'Iphone 15 128Gb Nuevo Negro',
            },
            price: {
              type: 'string',
              format: 'decimal',
              example: '4000000.00',
            },
            stock: {
              type: 'integer',
              example: -1,
            },
            image: {
              type: 'string',
              format: 'url',
              example: 'https://exitocol.vtexassets.com/arquivos/ids/22695882/iphone-15-128gb-nuevo-negro.jpg?v=638697002090670000',
            },
          },
        },
      },
      meta: {
        type: 'object',
        properties: {
          page: {
            type: 'string',
            example: '1',
          },
          take: {
            type: 'string',
            example: '10',
          },
          total: {
            type: 'integer',
            example: 3,
          },
          pageCount: {
            type: 'integer',
            example: 1,
          },
          hasPreviousPage: {
            type: 'boolean',
            example: false,
          },
          hasNextPage: {
            type: 'boolean',
            example: false,
          },
        },
      },
    },
  },
};
export { GetAllProductsResponse }