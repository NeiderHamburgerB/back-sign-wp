import { Injectable } from '@nestjs/common';
import { CardDto, TransactionDto } from '../schema/payment.schema';
import { Result } from 'src/common/utils/result';
import { PaymentRepository } from '../repositories/payment.repository';
import { ErrorPaymentMessages } from 'src/common/errors/payments/payments.error';

@Injectable()
export class PaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}
  async getAcceptanceTokens(): Promise<Result<any>> {
    try {
      const data = await this.paymentRepository.fetchAcceptanceTokens();
      const { presigned_acceptance, presigned_personal_data_auth } = data.data;

      return Result.ok({
        acceptanceToken: presigned_acceptance.acceptance_token,
        personalDataAuthToken: presigned_personal_data_auth.acceptance_token,
        permalinkA: presigned_acceptance.permalink,
        permalinkB: presigned_personal_data_auth.permalink,
      });
    } catch (error) {
      return Result.fail(ErrorPaymentMessages.failedFetchTokens.message, ErrorPaymentMessages.failedFetchTokens.status);
    }
  }

  async tokenizeCard(cardDto: CardDto): Promise<Result<string>> {
    try {
      const data = await this.paymentRepository.tokenizeCard(cardDto);
      const tokenId = data.data.id;
      return Result.ok(tokenId);
    } catch (error) {
      return Result.fail(ErrorPaymentMessages.failedTokenizeCard.message, ErrorPaymentMessages.failedTokenizeCard.status);
    }
  }
  
  async verifyTransaction(transactionId: string): Promise<Result<any>> {
    try {
      const data = await this.paymentRepository.verifyTransaction(transactionId);
      const info = data.data;
      return Result.ok(info);
    } catch (error) {
      return Result.fail(ErrorPaymentMessages.failedVerifyTransaction.message, ErrorPaymentMessages.failedVerifyTransaction.status);
    }
  }

  

  async createTransaction(transactionDto: TransactionDto): Promise<Result<any>> {
    try {
      const data = await this.paymentRepository.createTransaction(transactionDto);
      return Result.ok(data.data);
    } catch (error) {
      return Result.fail('Failed to create transaction', 500);
    }
  }
}
