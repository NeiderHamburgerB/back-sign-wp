import { Test, TestingModule } from '@nestjs/testing';
import { OrderRepository } from '../repositories/order.repository';
import { PaymentRepository } from 'src/modules/payment/repositories/payment.repository';
import { CustomerRepository } from 'src/modules/customer/repositories/customer.repository';
import { DataSource } from 'typeorm';
import { CreateOrderDto, UpdateOrderDto } from '../schema/order.schema';
import { Result } from 'src/common/utils/result';
import { PaymentStatus } from 'src/common/enums';
import { randomUUID } from 'crypto';
import { ErrorOrderMessages } from 'src/common/errors/orders/orders.error';
import { OrderService } from '../services/order.service';

describe('OrderService', () => {
  let service: OrderService;
  let orderRepository: jest.Mocked<OrderRepository>;
  let paymentRepository: jest.Mocked<PaymentRepository>;
  let customerRepository: jest.Mocked<CustomerRepository>;
  let dataSource: jest.Mocked<DataSource>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: OrderRepository,
          useValue: {
            createOrder: jest.fn(),
            getProductById: jest.fn(),
            createPayment: jest.fn(),
            createPaymentItems: jest.fn(),
            updateProductStock: jest.fn(),
            getUser: jest.fn(),
            updatePaymentStatus: jest.fn(),
          },
        },
        {
          provide: PaymentRepository,
          useValue: {
            createTransaction: jest.fn(),
          },
        },
        {
          provide: CustomerRepository,
          useValue: {
            save: jest.fn(),
          },
        },
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue({
              connect: jest.fn(),
              startTransaction: jest.fn(),
              commitTransaction: jest.fn(),
              rollbackTransaction: jest.fn(),
              release: jest.fn(),
              manager: {
                save: jest.fn(),
              },
            }),
          },
        },
      ],
    }).compile();

    service = module.get<OrderService>(OrderService);
    orderRepository = module.get(OrderRepository);
    paymentRepository = module.get(PaymentRepository);
    customerRepository = module.get(CustomerRepository);
    dataSource = module.get(DataSource);
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

      orderRepository.getProductById.mockResolvedValueOnce({ id: 1, stock: 10, name: 'Product', price: 1000, image: 'image.jpg' });
      orderRepository.createOrder.mockResolvedValueOnce({ id: 1, address: '123 Main St' } as any);
      customerRepository.save.mockResolvedValueOnce({ id: 2, firstName: 'John' } as any);
      orderRepository.createPayment.mockResolvedValueOnce({ id: 1 } as any);
      paymentRepository.createTransaction.mockResolvedValueOnce({ data: { id: 'transaction-1' } });

      const result = await service.createOrder(dto);

      expect(result.success).toBe(true);
      expect(orderRepository.getProductById).toHaveBeenCalledWith(1);
      expect(orderRepository.createOrder).toHaveBeenCalled();
      expect(customerRepository.save).toHaveBeenCalled();
      expect(paymentRepository.createTransaction).toHaveBeenCalled();
    });

    it('should fail if stock is insufficient', async () => {
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
          items: [{ productId: 1, quantity: 10, unitPrice: 1000 }],
        },
        cardToken: 'card_123',
        acceptanceToken: 'accept_123',
        personalDataAuthToken: 'auth_123',
        quotas: '1',
      };

      orderRepository.getProductById.mockResolvedValueOnce({ id: 1, stock: 5, name: 'Product', price: 1000, image: 'image.jpg' });

      const result = await service.createOrder(dto);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Producto Product no tiene suficiente stock');
    });

    it('should fail if product does not exist', async () => {
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
          items: [{ productId: 99, quantity: 1, unitPrice: 1000 }],
        },
        cardToken: 'card_123',
        acceptanceToken: 'accept_123',
        personalDataAuthToken: 'auth_123',
        quotas: '1',
      };

      orderRepository.getProductById.mockResolvedValueOnce(null);

      const result = await service.createOrder(dto);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Producto con id 99 no encontrado');
    });

    it('should handle database errors gracefully', async () => {
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

      orderRepository.createOrder.mockRejectedValueOnce(new Error('Database error'));

      const result = await service.createOrder(dto);

      expect(result.success).toBe(false);
      expect(result.error).toBe(ErrorOrderMessages.failedCreateOrder.message);
    });
  });

  describe('updateOrder', () => {
    it('should update an order successfully', async () => {
      const dto: UpdateOrderDto = {
        status: PaymentStatus.APPROVED,
        id: '12345',
        methodName: 'VISA',
        finalizedAt: new Date().toISOString(),
      };

      orderRepository.updatePaymentStatus.mockResolvedValueOnce('Order updated');

      const result = await service.updateOrder('reference123', dto);

      expect(result.success).toBe(true);
      expect(result.value).toBe('Order updated');
      expect(orderRepository.updatePaymentStatus).toHaveBeenCalledWith('reference123', dto);
    });

    it('should handle errors during update', async () => {
      const dto: UpdateOrderDto = {
        status: PaymentStatus.APPROVED,
        id: '12345',
        methodName: 'VISA',
        finalizedAt: new Date().toISOString(),
      };

      orderRepository.updatePaymentStatus.mockRejectedValueOnce(new Error('Update error'));

      const result = await service.updateOrder('reference123', dto);

      expect(result.success).toBe(false);
      expect(result.error).toBe(ErrorOrderMessages.failedUpdateOrder.message);
    });
  });
});
