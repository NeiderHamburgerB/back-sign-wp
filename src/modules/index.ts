import { Module } from '@nestjs/common';
import { PaymentModule } from './payment/payment.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [
    PaymentModule,
    OrderModule,
    ProductModule
  ],
  controllers: [],
})
export class ApiModule {}
