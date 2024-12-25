import { Module } from '@nestjs/common';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderRepository } from './repositories/order.repository';
import { Payment } from '../payment/entities/payment.entity';
import { PaymentItem } from '../payment/entities/paymentItem.entity';
import { PaymentModule } from '../payment/payment.module';
import { CustomerModule } from '../customer/customer.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Order,
      Payment,
      PaymentItem 
    ]),
    PaymentModule,
    CustomerModule    
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
})
export class OrderModule {}
