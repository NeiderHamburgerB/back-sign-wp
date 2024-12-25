import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Order } from '../entities/order.entity';
import { Payment } from 'src/modules/payment/entities/payment.entity';
import { PaymentItem } from 'src/modules/payment/entities/paymentItem.entity';
import { Result } from 'src/common/utils/result';
import { OrderRepository } from '../repositories/order.repository';
import { CreateOrderDto, UpdateOrderDto } from '../schema/order.schema';
import { PaymentStatus } from 'src/common/enums';
import { randomUUID } from 'crypto';
import { PaymentRepository } from 'src/modules/payment/repositories/payment.repository';
import { CustomerRepository } from 'src/modules/customer/repositories/customer.repository';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { generateIntegrityHash } from 'src/common/utils/generateHash';
import { ErrorOrderMessages } from 'src/common/errors/orders/orders.error';
import { CreatePaymentItemDto } from 'src/modules/payment/schema/paymentItem.schema';
import { constants } from 'src/common';
import { OrderResponseDto } from 'src/common/interfaces/order.interface';
@Injectable()
export class OrderService {

  private readonly privateKey: string;
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paymentRepository: PaymentRepository,
    private readonly customerRepository: CustomerRepository,
    private readonly dataSource: DataSource,
  ) {
    this.privateKey = constants.WOMPI_SECRET_KEY
  }

  async createOrder(dto: CreateOrderDto): Promise<Result<OrderResponseDto>> {
    console.log('Creating Order with Payment', dto);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // verify stock
      const valid = await this.checkStockAvailability(dto.payment.items);

      if (valid.error) {
        return Result.fail(valid.error);
      }
      // create Order
      const savedOrder = await this.createOrderRecord(dto);

      // manage Customer
      const customerId = await this.getOrCreateCustomer(dto);

      // create Payment
      const payment = await this.createPaymentRecord(dto, savedOrder, customerId);

      // create Payment Items and update stock
      await this.createPaymentItemsAndUpdateStock(dto.payment.items, payment);

      // create Transaction
      const transaction = await this.createTransaction(dto, payment);

      // save transaction data
      await queryRunner.commitTransaction();

      return Result.ok(transaction.data);
    } catch (err) {
      await queryRunner.rollbackTransaction();
      console.error(err);
      return Result.fail(ErrorOrderMessages.failedCreateOrder.message, ErrorOrderMessages.failedCreateOrder.status);
    } finally {
      await queryRunner.release();
    }
  }

  private async checkStockAvailability(items: CreatePaymentItemDto[]): Promise<Result<string>> {
    for (const itemDto of items) {
      const product = await this.orderRepository.getProductById(itemDto.productId);

      if (!product) {
        return Result.fail(`Producto con id ${itemDto.productId} no encontrado`);
      }

      if (product.stock < itemDto.quantity) {
        return Result.fail(`Producto ${product.name} no tiene suficiente stock`);
      }
    }

    return Result.ok('success');
  }

  private async createOrderRecord(dto: CreateOrderDto): Promise<Order> {
    const order = new Order();
    order.address = dto.address;
    order.city = dto.city;
    order.phone = dto.phone;
    order.status = dto.status || 'PENDING';

    return await this.orderRepository.createOrder(order);
  }

  private async getOrCreateCustomer(dto: CreateOrderDto): Promise<number> {
    const customer = await this.orderRepository.getUser(dto.email);

    if (!customer) {
      const newCustomer = new Customer();
      newCustomer.email = dto.email;
      newCustomer.firstName = dto.firstName;

      const result = await this.customerRepository.save(newCustomer);
      return result.id;
    }

    return customer.id;
  }

  private async createPaymentRecord(dto: CreateOrderDto, order: Order, customerId: number): Promise<Payment> {
    const payment = new Payment();
    payment.amount = dto.payment.amount;
    payment.currency = 'COP';
    payment.paymentStatus = PaymentStatus.PENDING;
    payment.datePayment = new Date();
    payment.referenceSale = `WOMPI-${randomUUID()}`;
    payment.order = order;
    payment.orderId = order.id;
    payment.customerId = customerId;

    return await this.orderRepository.createPayment(payment);
  }

  private async createPaymentItemsAndUpdateStock(items: CreatePaymentItemDto[], payment: Payment): Promise<void> {
    const paymentItems: PaymentItem[] = [];

    for (const itemDto of items) {
      const item = new PaymentItem();
      item.productId = itemDto.productId;
      item.quantity = itemDto.quantity;
      item.unitPrice = itemDto.unitPrice;
      item.payment = payment;
      paymentItems.push(item);
      // update stock
      await this.orderRepository.updateProductStock(itemDto.productId, itemDto.quantity);
    }

    await this.orderRepository.createPaymentItems(paymentItems);
  }

  private async createTransaction(dto: CreateOrderDto, payment: Payment): Promise<any> {
    
    const integritySecret = this.privateKey;
    
    const hash = generateIntegrityHash(payment.referenceSale, payment.amount, payment.currency, integritySecret, '');
    
    return await this.paymentRepository.createTransaction({
      "acceptance_token": dto.acceptanceToken,
      "accept_personal_auth": dto.personalDataAuthToken,
      "permalink": "https://wompi.com/assets/downloadble/reglamento-Usuarios-Colombia.pdf",
      "amount_in_cents": payment.amount,
      "currency": payment.currency,
      "signature": hash,
      "customer_email": dto.email,
      "reference": payment.referenceSale,
      "payment_method": {
        "type": "CARD",
        "installments": parseInt(dto.quotas),
        "token": dto.cardToken
      }
    });

  }

  async updateOrder(reference: string, dto: UpdateOrderDto): Promise<Result<string>> {
    try {
      const data = await this.orderRepository.updatePaymentStatus(reference, dto);
      return Result.ok(data);
    } catch (error) {
      return Result.fail(ErrorOrderMessages.failedUpdateOrder.message, ErrorOrderMessages.failedUpdateOrder.status);
    }
  }

}
