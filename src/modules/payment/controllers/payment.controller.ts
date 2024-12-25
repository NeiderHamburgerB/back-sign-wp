import { Controller, Get, Post, Body, Param, HttpStatus, HttpException } from '@nestjs/common';
import { CardDto, CardDtoSchema } from '../schema/payment.schema';
import { PaymentService } from '../services/payment.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { ApiGetTokens, CardsResponse, VerifyTransactionResponse } from '../docs/payment.doc';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @ApiOperation({
    summary:
      'Verify a transaction',
  })
  @ApiOkResponse(VerifyTransactionResponse)
  @Get('verify/:transactionId')
  async verifyTransaction(
    @Param('transactionId') transactionId: string
  ) {
    const result = await this.paymentService.verifyTransaction(transactionId);
    if (!result.success) {
      throw new HttpException(result.error, result.status || HttpStatus.BAD_REQUEST);
    }
    return { data: result.value };
  }

  @ApiOperation({
    summary:
      'Get acceptance tokens',
  })
  @ApiOkResponse(ApiGetTokens)
  @Get('tokens')
  async getTokens() {
    const result = await this.paymentService.getAcceptanceTokens();
    if (!result.success) {
      throw new HttpException(result.error, result.status || HttpStatus.BAD_REQUEST);
    }
    return { data: result.value };
  }

  @ApiOperation({
    summary:
      'Tokenize a card',
  })
  @ApiOkResponse(CardsResponse)
  @Post('cards')
  async tokenizeCard(@Body(
    new ZodValidationPipe(CardDtoSchema)
  ) cardDto: CardDto) {
    const result = await this.paymentService.tokenizeCard(cardDto);
    if (!result.success) {
      throw new HttpException(result.error, result.status || HttpStatus.BAD_REQUEST);
    }
    return { data: result.value };
  }

}
