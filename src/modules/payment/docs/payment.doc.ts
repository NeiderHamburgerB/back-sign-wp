import { ApiResponseOptions } from '@nestjs/swagger';

const ApiGetTokens: ApiResponseOptions = {
  status: 200,
  description: 'Response with acceptance token and related links.',
  schema: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          acceptanceToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6MjQzLCJwZXJtYWxpbmsiOiJodHRwczovL3dvbXBpLmNvbS9hc3NldHMvZG93bmxvYWRibGUvcmVnbGFtZW50by1Vc3Vhcmlvcy1Db2xvbWJpYS5wZGYiLCJmaWxlX2hhc2giOiJkMWVkMDI3NjhlNDEzZWEyMzFmNzAwMjc0N2Y0N2FhOSIsImppdCI6IjE3MzUwNzI1OTEtNDU4NTUiLCJlbWFpbCI6IiIsImV4cCI6MTczNTA3NjE5MX0.gesZIPhSe33WzZ_3cnCFDjZnp42zSDyOLYSU4xgPMEA' },
          personalDataAuthToken: { type: 'string', example: 'eyJhbGciOiJIUzI1NiJ9.eyJjb250cmFjdF9pZCI6Mzc1LCJwZXJtYWxpbmsiOiJodHRwczovL3dvbXBpLmNvbS9hc3NldHMvZG93bmxvYWRibGUvYXV0b3JpemFjaW9uLWFkbWluaXN0cmFjaW9uLWRhdG9zLXBlcnNvbmFsZXMucGRmIiwiZmlsZV9oYXNoIjoiOTVkYzcwN2M0M2UxYmViMDAwMDUyZDNkNWJhZThhMDAiLCJqaXQiOiIxNzM1MDcyNTkxLTMxMjc2IiwiZW1haWwiOiIifQ.JYyWzfW3iXQAqM2OFwyA6_DveBaE_D2USNoAqSzjjuc' },
          permalinkA: { type: 'string', example: 'https://wompi.com/assets/downloadble/reglamento-Usuarios-Colombia.pdf' },
          permalinkB: { type: 'string', example: 'https://wompi.com/assets/downloadble/autorizacion-administracion-datos-personales.pdf' },
        },
      },
    },
  },
};

const CardsResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response with a card token.',
  schema: {
    type: 'object',
    properties: {
      data: {
        type: 'string',
        example: 'tok_stagtest_5113_3c1ea096A9C8A1fa6d6c7a38783d9bc3',
      },
    },
  },
};

const VerifyTransactionResponse: ApiResponseOptions = {
  status: 200,
  description: 'Response for verifying a transaction.',
  schema: {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '15113-1735024370-44785' },
          created_at: { type: 'string', format: 'date-time', example: '2024-12-24T07:12:50.871Z' },
          finalized_at: { type: 'string', format: 'date-time', example: '2024-12-24T07:12:53.301Z' },
          amount_in_cents: { type: 'number', example: 3800000 },
          reference: { type: 'string', example: 'WOMPI-1e0efb76-5f4e-4bcb-a922-a5ace648f942' },
          currency: { type: 'string', example: 'COP' },
          payment_method_type: { type: 'string', example: 'CARD' },
          payment_method: {
            type: 'object',
            properties: {
              type: { type: 'string', example: 'CARD' },
              extra: {
                type: 'object',
                properties: {
                  name: { type: 'string', example: 'VISA-4242' },
                  brand: { type: 'string', example: 'VISA' },
                  card_type: { type: 'string', example: 'CREDIT' },
                  last_four: { type: 'string', example: '4242' },
                  is_three_ds: { type: 'boolean', example: false },
                  three_ds_auth: {
                    type: 'object',
                    properties: {
                      three_ds_auth: {
                        type: 'object',
                        properties: {
                          current_step: { type: 'string', example: 'AUTHENTICATION' },
                          current_step_status: { type: 'string', example: 'COMPLETED' },
                        },
                      },
                    },
                  },
                  three_ds_auth_type: { type: 'string', nullable: true, example: null },
                  external_identifier: { type: 'string', example: 'Y3ogDSwWSh' },
                  processor_response_code: { type: 'string', example: '00' },
                },
              },
              installments: { type: 'number', example: 1 },
            },
          },
          payment_link_id: { type: 'string', nullable: true, example: null },
          redirect_url: { type: 'string', nullable: true, example: null },
          status: { type: 'string', example: 'APPROVED' },
          status_message: { type: 'string', nullable: true, example: null },
          merchant: {
            type: 'object',
            properties: {
              id: { type: 'number', example: 5113 },
              name: { type: 'string', example: 'Alejandra Pruebas Sandbox UAT' },
              legal_name: { type: 'string', example: 'Alejandra Pruebas Sandbox UAT' },
              contact_name: { type: 'string', example: 'Alejandra Pruebas Sandbox UAT' },
              phone_number: { type: 'string', example: '+573000000000' },
              logo_url: { type: 'string', nullable: true, example: null },
              legal_id_type: { type: 'string', example: 'CC' },
              email: { type: 'string', example: 'pruebasensandbox@yopmail.com' },
              legal_id: { type: 'string', example: '1069879849' },
              public_key: { type: 'string', example: 'pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7' },
            },
          },
          taxes: { type: 'array', items: { type: 'object' }, example: [] },
          tip_in_cents: { type: 'number', nullable: true, example: null },
        },
      },
    },
  },
};

export { ApiGetTokens, CardsResponse, VerifyTransactionResponse };