import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/entities/base.entity';
import { PaymentStatus } from 'src/common/enums';
import { Column, Entity, OneToMany, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { PaymentItem } from './paymentItem.entity';
import { Order } from 'src/modules/order/entities/order.entity';
import { Customer } from 'src/modules/customer/entities/customer.entity';

@Entity({ name: 'payments' })
export class Payment extends Base {
  @ApiProperty({ description: 'Total pagado' })
  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @ApiProperty({ description: 'Moneda del pago' })
  @Column({ type: 'varchar', default: 'COP' })
  currency: string;

  @ApiProperty({ description: 'Estado del pago', enum: PaymentStatus })
  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  paymentStatus: PaymentStatus;

  @ApiProperty({ description: 'Fecha de pago efectivo/aprobado', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  datePayment?: Date;

  @ApiProperty({ description: 'ID devuelto por el gateway', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  gatewayTransactionId?: string;

  @ApiProperty({ description: 'Fecha/hora de la transacción', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  transactionDate?: Date;

  @ApiProperty({ description: 'Método de pago (CARD, PSE, etc.)', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentMethod?: string;

  @ApiProperty({ description: 'Nombre detallado del método (e.g. VISA-4242)', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  paymentMethodName?: string;

  @ApiProperty({ description: 'Fecha/hora de la operación', required: false })
  @Column({ type: 'timestamptz', nullable: true })
  operationDate?: Date;

  @ApiProperty({ description: 'Referencia que enviaste al gateway', required: false })
  @Column({ type: 'varchar', length: 255, nullable: true })
  referenceSale?: string;

  @OneToMany(() => PaymentItem, (item) => item.payment, { cascade: true })
  items: PaymentItem[];

  @OneToOne(() => Order, (order) => order.payment, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'orderId' })
  order: Order;

  @Column({ type: 'int', nullable: true })
  orderId: number; 

  @ManyToOne(() => Customer, (customer) => customer.id)
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @ApiProperty({
    description: 'Usuario que realizo el pago',
  })
  @Column({ type: 'int', nullable: true })
  customerId?: number;
}
