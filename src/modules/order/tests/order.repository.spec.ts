import { Payment } from "src/modules/payment/entities/payment.entity";
import { Order } from "../entities/order.entity";
import { OrderRepository } from "../repositories/order.repository";
import { DataSource } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { PaymentItem } from "src/modules/payment/entities/paymentItem.entity";
import { Product } from "src/modules/product/entities/product.entity";
import { Customer } from "src/modules/customer/entities/customer.entity";
import { UpdateOrderDto } from "../schema/order.schema";

const mockOrderRepo = {
  save: jest.fn().mockResolvedValue({}),
};

const mockPaymentRepo = {
  save: jest.fn().mockResolvedValue({}),
};

const mockDataSource = {
  createQueryRunner: jest.fn().mockReturnValue({
    connect: jest.fn(),
    startTransaction: jest.fn(),
    commitTransaction: jest.fn(),
    rollbackTransaction: jest.fn(),
    release: jest.fn(),
    manager: {
      save: jest.fn().mockResolvedValue({}),
      getRepository: jest.fn().mockReturnValue({
        findOne: jest.fn().mockResolvedValue(null),
        decrement: jest.fn().mockResolvedValue(undefined),
      }),
    },
  }),
  getRepository: jest.fn().mockReturnValue({
    findOne: jest.fn().mockResolvedValue(null),
    decrement: jest.fn().mockResolvedValue(undefined),
  }),
};

describe('OrderRepository', () => {
  let repository: OrderRepository;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderRepository,
        {
          provide: getRepositoryToken(Order),
          useValue: mockOrderRepo,
        },
        {
          provide: getRepositoryToken(Payment),
          useValue: mockPaymentRepo,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    repository = module.get<OrderRepository>(OrderRepository);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createOrder', () => {
    it('should create an order successfully', async () => {
      const order = new Order();
      order.id = 1;
      mockOrderRepo.save.mockResolvedValue(order);

      const result = await repository.createOrder(order);

      expect(mockOrderRepo.save).toHaveBeenCalledWith(order);
      expect(result).toEqual(order);
    });
  });

  describe('createPayment', () => {
    it('should create a payment successfully', async () => {
      const payment = new Payment();
      payment.id = 1;
      mockPaymentRepo.save.mockResolvedValue(payment);

      const result = await repository.createPayment(payment);

      expect(mockPaymentRepo.save).toHaveBeenCalledWith(payment);
      expect(result).toEqual(payment);
    });
  });

  describe('createPaymentItems', () => {
    it('should create payment items successfully', async () => {
      const paymentItems = [new PaymentItem(), new PaymentItem()];
      const queryRunner = dataSource.createQueryRunner();

      (queryRunner.manager.save as jest.Mock).mockResolvedValue(paymentItems);

      const result = await repository.createPaymentItems(paymentItems);

      expect(queryRunner.connect).toHaveBeenCalled();
      expect(queryRunner.manager.save).toHaveBeenCalledWith(PaymentItem, paymentItems);
      expect(queryRunner.release).toHaveBeenCalled();
      expect(result).toEqual(paymentItems);
    });

    it('should handle errors and rollback transaction', async () => {
      const paymentItems = [new PaymentItem(), new PaymentItem()];
      const queryRunner = dataSource.createQueryRunner();

      (queryRunner.manager.save as jest.Mock).mockRejectedValue(new Error('Save failed'));

      await expect(repository.createPaymentItems(paymentItems)).rejects.toThrow('Save failed');
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(queryRunner.release).toHaveBeenCalled();
    });
  });

  describe('getProductById', () => {
    it('should return a product by ID', async () => {
      const product = new Product();
      product.id = 1;
      mockDataSource.getRepository(Product).findOne.mockResolvedValue(product);

      const result = await repository.getProductById(1);

      expect(mockDataSource.getRepository(Product).findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(product);
    });
  });

  describe('updateProductStock', () => {
    it('should decrement product stock successfully', async () => {
      await repository.updateProductStock(1, 5);

      expect(mockDataSource.getRepository(Product).decrement).toHaveBeenCalledWith({ id: 1 }, 'stock', 5);
    });
  });

  describe('getUser', () => {
    it('should return a user by email', async () => {
      const customer = new Customer();
      customer.email = 'test@example.com';
      mockDataSource.getRepository(Customer).findOne.mockResolvedValue(customer);

      const result = await repository.getUser('test@example.com');

      expect(mockDataSource.getRepository(Customer).findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(result).toEqual(customer);
    });
  });

  describe('updatePaymentStatus', () => {
    it('should update payment and order status successfully', async () => {
      const queryRunner = dataSource.createQueryRunner();
      const payment = new Payment();
      const order = new Order();
      const updateOrderDto: UpdateOrderDto = {
        status: 'PAID',
        finalizedAt: new Date().toISOString(),
        methodName: 'Card',
        id: '123',
      };

      (queryRunner.manager.getRepository(Payment).findOne as jest.Mock).mockResolvedValue(payment);
      (queryRunner.manager.getRepository(Order).findOne as jest.Mock).mockResolvedValue(order);

      const result = await repository.updatePaymentStatus('ref123', updateOrderDto);

      expect(queryRunner.startTransaction).toHaveBeenCalled();
      expect(queryRunner.manager.save).toHaveBeenCalledWith(payment);
      expect(queryRunner.manager.save).toHaveBeenCalledWith(order);
      expect(queryRunner.commitTransaction).toHaveBeenCalled();
      expect(result).toContain('actualizado exitosamente');
    });

    it('should handle errors and rollback transaction', async () => {
      const queryRunner = dataSource.createQueryRunner();
      (queryRunner.manager.getRepository(Payment).findOne as jest.Mock).mockRejectedValue(new Error('Payment not found'));

      const updateOrderDto: UpdateOrderDto = {
        status: 'PAID',
        finalizedAt: new Date().toISOString(),
        methodName: 'Card',
        id: '123',
      };

      await expect(repository.updatePaymentStatus('ref123', updateOrderDto)).rejects.toThrow('Payment not found');
      expect(queryRunner.rollbackTransaction).toHaveBeenCalled();
    });
  });
});
