import { Base } from 'src/common/entities/base.entity';
import { Payment } from 'src/modules/payment/entities/payment.entity';
import {
  Entity,
  Column,
  OneToOne,
} from 'typeorm';

@Entity({ name: 'orders' })
export class Order extends Base {

  @Column()
  address: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ default: 'PENDING' })
  status: string; 
  
  @OneToOne(() => Payment, (payment) => payment.order)
  payment: Payment;

}
