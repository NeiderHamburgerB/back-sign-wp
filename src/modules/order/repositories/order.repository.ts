import { Injectable } from '@nestjs/common';
import { Repository, DataSource, QueryRunner } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from '../entities/order.entity';
import { Payment } from 'src/modules/payment/entities/payment.entity';
import { PaymentItem } from 'src/modules/payment/entities/paymentItem.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Customer } from 'src/modules/customer/entities/customer.entity';
import { UpdateOrderDto } from '../schema/order.schema';
import { PaymentMethods } from 'src/common/enums';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order) private readonly orderRepo: Repository<Order>,
    @InjectRepository(Payment) private readonly paymentRepo: Repository<Payment>,
    private readonly dataSource: DataSource,
  ) { }

  async createOrder(order: Order): Promise<Order> {
    return this.orderRepo.save(order);
  }

  async createPayment(payment: Payment): Promise<Payment> {
    return this.paymentRepo.save(payment);
  }

  async createPaymentItems(items: PaymentItem[]): Promise<PaymentItem[]> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
      const savedItems = await queryRunner.manager.save(PaymentItem, items);
      await queryRunner.release();
      return savedItems;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    }
  }

  async getProductById(productId: number): Promise<Product | null> {
    return await this.dataSource.getRepository(Product).findOne({ where: { id: productId } });
  }

  async updateProductStock(productId: number, quantity: number): Promise<void> {
    await this.dataSource
      .getRepository(Product)
      .decrement({ id: productId }, 'stock', quantity);
  }

  async getUser(email: string): Promise<Customer> {
    return await this.dataSource
      .getRepository(Customer)
      .findOne({ where: { email } });
  }

  async updatePaymentStatus(referenceSale: string, updateOrder: UpdateOrderDto): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const payment = await this.findPayment(queryRunner, referenceSale);

      // update payment status
      this.updatePaymentDetails(payment, updateOrder);
      await queryRunner.manager.save(payment);

      const order = await this.findOrder(queryRunner, payment.orderId);

      // update order status
      this.updateOrderDetails(order, updateOrder);
      await queryRunner.manager.save(order);

      // save changes
      await queryRunner.commitTransaction();

      return `El estado del pago con referencia ${referenceSale} ha sido actualizado exitosamente a ${updateOrder.status}`;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Error actualizando el estado del pago: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  private async findPayment(queryRunner: QueryRunner, referenceSale: string): Promise<Payment> {
    const payment = await queryRunner.manager
      .getRepository(Payment)
      .findOne({ where: { referenceSale } });

    if (!payment) {
      throw new Error(`No se encontró el pago con la referencia ${referenceSale}`);
    }

    return payment;
  }

  private updatePaymentDetails(payment: Payment, updateOrder: UpdateOrderDto): void {
    payment.paymentStatus = updateOrder.status;
    payment.datePayment = new Date(updateOrder.finalizedAt);
    payment.paymentMethod = PaymentMethods.CARD;
    payment.paymentMethodName = updateOrder.methodName;
    payment.operationDate = new Date(updateOrder.finalizedAt);
    payment.gatewayTransactionId = updateOrder.id;
  }

  private async findOrder(queryRunner: QueryRunner, orderId: number): Promise<Order> {
    const order = await queryRunner.manager
      .getRepository(Order)
      .findOne({ where: { id: orderId } });

    if (!order) {
      throw new Error(`No se encontró la orden asociada al pago con ID ${orderId}`);
    }

    return order;
  }

  private updateOrderDetails(order: Order, updateOrder: UpdateOrderDto): void {
    order.status = updateOrder.status;
  }




}

