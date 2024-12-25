import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/entities/base.entity';
import { Payment } from './payment.entity';
import { Product } from 'src/modules/product/entities/product.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'payment_items' })
export class PaymentItem extends Base {
  @ApiProperty({ description: 'Cantidad comprada' })
  @Column('int', { default: 1 })
  quantity: number;

  @ApiProperty({ description: 'Precio unitario' })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  unitPrice: number;

  @ManyToOne(() => Payment, (payment) => payment.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'paymentId' })
  payment: Payment;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'productId' })
  product: Product;

  @Column({ type: 'int', nullable: true })
  productId: number;
  
}
