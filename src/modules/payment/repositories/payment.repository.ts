import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { CardDto, TransactionDto } from '../schema/payment.schema';
import { constants } from 'src/common';


@Injectable()
export class PaymentRepository {
  private readonly baseUrl: string;
  private readonly keyPublic: string;

  constructor(
    private readonly httpService: HttpService,     
  ) {
    this.baseUrl = constants.WOMPI_BASE_URL;
    this.keyPublic = constants.WOMPI_PUBLIC_KEY;
  }

  async fetchAcceptanceTokens(): Promise<any> {
    const response = await lastValueFrom(
      this.httpService.get(`${this.baseUrl}/merchants/pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7`)
    );
    return response.data;
  }

  async tokenizeCard(cardDto: CardDto): Promise<any> {
    console.log(this.baseUrl)
    const response = await lastValueFrom(
      this.httpService.post(`${this.baseUrl}/tokens/cards`, cardDto, {
        headers: {
          Authorization: `Bearer ${this.keyPublic}`,
        },
      })
    );
    return response.data;
  }

  async createTransaction(transactionDto: TransactionDto): Promise<any> {
    const response = await lastValueFrom(
      this.httpService.post(`${this.baseUrl}/transactions`, transactionDto,{
        headers: {
          Authorization: `Bearer ${this.keyPublic}`,
        },
      })
    );
    return response.data;
  }

  async verifyTransaction(transactionId: string): Promise<any> {
    const response = await lastValueFrom(
      this.httpService.get(`${this.baseUrl}/transactions/${transactionId}`)
    );
    return response.data;
  }

  

}
