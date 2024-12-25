import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from '../services/order.service';
import { CreateOrderDto, UpdateOrderDto } from '../schema/order.schema';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PaymentStatus } from 'src/common/enums';
import { OrderController } from '../controllers/order.controller';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        {
          provide: OrderService,
          useValue: {
            createOrder: jest.fn(),
            updateOrder: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const dto: CreateOrderDto = {
        address: '123 Main St',
        city: 'Metropolis',
        phone: '123456789',
        email: 'test@example.com',
        firstName: 'John',
        status: 'PENDING',
        payment: {
          currency: 'COP',
          paymentStatus: PaymentStatus.PENDING,
          amount: 1000,
          items: [{ productId: 1, quantity: 1, unitPrice: 1000 }],
        },
        cardToken: 'card_123',
        acceptanceToken: 'accept_123',
        personalDataAuthToken: 'auth_123',
        quotas: '1',
      };

      const mockResponse = {
        id: '15113-1735074948-40606',
        created_at: '2024-12-24T21:15:49.208Z',
        finalized_at: null,
        amount_in_cents: 4000000,
        reference: 'WOMPI-b7b609e6-6ded-4ee7-9bcd-0fdd35f6ba5e',
        customer_email: 'ss@gmail.com',
        currency: 'COP',
        payment_method_type: 'CARD',
        payment_method: {
          type: 'CARD',
          extra: {
            bin: '424242',
            name: 'VISA-4242',
            brand: 'VISA',
            exp_year: '28',
            card_type: 'CREDIT',
            exp_month: '08',
            last_four: '4242',
            card_holder: 'José Pérez',
            is_three_ds: false,
            three_ds_auth_type: null,
          },
          installments: 1,
        },
        status: 'PENDING',
        status_message: null,
        billing_data: null,
        shipping_address: null,
        redirect_url: null,
        payment_source_id: null,
        payment_link_id: null,
        customer_data: null,
        bill_id: null,
        taxes: [],
        tip_in_cents: null,
      };

      jest.spyOn(service, 'createOrder').mockResolvedValueOnce({ success: true, value: mockResponse });

      const result = await controller.createOrder(dto);

      expect(result).toEqual({ data: mockResponse });
      expect(service.createOrder).toHaveBeenCalledWith(dto);
    });

    it('should throw an exception when order creation fails', async () => {
      const dto: CreateOrderDto = {
        address: '123 Main St',
        city: 'Metropolis',
        phone: '123456789',
        email: 'test@example.com',
        firstName: 'John',
        status: 'PENDING',
        payment: {
          currency: 'COP',
          paymentStatus: PaymentStatus.PENDING,
          amount: 1000,
          items: [{ productId: 1, quantity: 1, unitPrice: 1000 }],
        },
        cardToken: 'card_123',
        acceptanceToken: 'accept_123',
        personalDataAuthToken: 'auth_123',
        quotas: '1',
      };

      jest.spyOn(service, 'createOrder').mockResolvedValueOnce({
        success: false,
        error: 'Error creating order',
      });

      await expect(controller.createOrder(dto)).rejects.toThrow(HttpException);
      expect(service.createOrder).toHaveBeenCalledWith(dto);
    });
  });

  describe('updateTransaction', () => {
    it('should update an order successfully', async () => {
      const dto: UpdateOrderDto = {
        status: PaymentStatus.APPROVED,
        id: '12345',
        methodName: 'VISA',
        finalizedAt: new Date().toISOString(),
      };

      const mockResponse = 'Order updated successfully';

      jest.spyOn(service, 'updateOrder').mockResolvedValueOnce({ success: true, value: mockResponse });

      const result = await controller.updateTransaction('reference123', dto);

      expect(result).toEqual({ data: mockResponse });
      expect(service.updateOrder).toHaveBeenCalledWith('reference123', dto);
    });

    it('should throw an exception when update fails', async () => {
      const dto: UpdateOrderDto = {
        status: PaymentStatus.APPROVED,
        id: '12345',
        methodName: 'VISA',
        finalizedAt: new Date().toISOString(),
      };

      jest.spyOn(service, 'updateOrder').mockResolvedValueOnce({
        success: false,
        error: 'Error updating order',
        status: HttpStatus.BAD_REQUEST,
      });

      await expect(controller.updateTransaction('reference123', dto)).rejects.toThrow(HttpException);
      expect(service.updateOrder).toHaveBeenCalledWith('reference123', dto);
    });
  });
});
