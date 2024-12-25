import { Module } from '@nestjs/common';
import { PaymentController } from './controllers/payment.controller';
import { PaymentService } from './services/payment.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { PaymentRepository } from './repositories/payment.repository';
import { HttpModule } from '@nestjs/axios';
import { PaymentItem } from './entities/paymentItem.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment, PaymentItem]),
    HttpModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentRepository],
  exports: [PaymentService, HttpModule, PaymentRepository],
})
export class PaymentModule {}
