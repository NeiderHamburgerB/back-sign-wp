import { ApiResponseOptions } from '@nestjs/swagger';

const OrderResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response for a new order.',
  schema: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '15113-1735074948-40606' },
          created_at: { type: 'string', format: 'date-time', example: '2024-12-24T21:15:49.208Z' },
          finalized_at: { type: 'string', nullable: true, example: null },
          amount_in_cents: { type: 'number', example: 4000000 },
          reference: { type: 'string', example: 'WOMPI-b7b609e6-6ded-4ee7-9bcd-0fdd35f6ba5e' },
          customer_email: { type: 'string', example: 'ss@gmail.com' },
          currency: { type: 'string', example: 'COP' },
          payment_method_type: { type: 'string', example: 'CARD' },
          payment_method: {
            type: 'object',
            properties: {
              type: { type: 'string', example: 'CARD' },
              extra: {
                type: 'object',
                properties: {
                  bin: { type: 'string', example: '424242' },
                  name: { type: 'string', example: 'VISA-4242' },
                  brand: { type: 'string', example: 'VISA' },
                  exp_year: { type: 'string', example: '28' },
                  card_type: { type: 'string', example: 'CREDIT' },
                  exp_month: { type: 'string', example: '08' },
                  last_four: { type: 'string', example: '4242' },
                  card_holder: { type: 'string', example: 'José Pérez' },
                  is_three_ds: { type: 'boolean', example: false },
                  three_ds_auth_type: { type: 'string', nullable: true, example: null },
                },
              },
              installments: { type: 'number', example: 1 },
            },
          },
          status: { type: 'string', example: 'PENDING' },
          status_message: { type: 'string', nullable: true, example: null },
          billing_data: { type: 'object', nullable: true, example: null },
          shipping_address: { type: 'object', nullable: true, example: null },
          redirect_url: { type: 'string', nullable: true, example: null },
          payment_source_id: { type: 'string', nullable: true, example: null },
          payment_link_id: { type: 'string', nullable: true, example: null },
          customer_data: { type: 'object', nullable: true, example: null },
          bill_id: { type: 'string', nullable: true, example: null },
          taxes: { type: 'array', items: { type: 'object' }, example: [] },
          tip_in_cents: { type: 'number', nullable: true, example: null },
        },
      },
    },
  },
};

const UpdateOrderResponse: ApiResponseOptions = {
    status: 200,
    description: 'Response for update an order.',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'string',
          example: 'La orden ha sido actualizada con exito',
        },
      },
    },
  };


export { OrderResponse, UpdateOrderResponse };