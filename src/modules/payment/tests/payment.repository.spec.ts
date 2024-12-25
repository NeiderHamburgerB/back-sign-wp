import { Test, TestingModule } from '@nestjs/testing';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { constants } from 'src/common';
import { CardDto, TransactionDto } from '../schema/payment.schema';
import { PaymentRepository } from '../repositories/payment.repository';

const mockHttpService = {
  get: jest.fn(),
  post: jest.fn(),
};

describe('PaymentRepository', () => {
  let repository: PaymentRepository;
  let httpService: HttpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentRepository,
        {
          provide: HttpService,
          useValue: mockHttpService,
        },
      ],
    }).compile();

    repository = module.get<PaymentRepository>(PaymentRepository);
    httpService = module.get<HttpService>(HttpService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('fetchAcceptanceTokens', () => {
    it('should return acceptance tokens on success', async () => {
      const mockResponse = {
        data: {
          presigned_acceptance: {
            acceptance_token: 'acceptance-token',
          },
        },
      };
      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await repository.fetchAcceptanceTokens();

      expect(httpService.get).toHaveBeenCalledWith(`${constants.WOMPI_BASE_URL}/merchants/pub_stagtest_g2u0HQd3ZMh05hsSgTS2lUV8t3s4mOt7`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when the request fails', async () => {
      mockHttpService.get.mockReturnValue(of(Promise.reject(new Error('Error fetching tokens'))));

      await expect(repository.fetchAcceptanceTokens()).rejects.toThrow('Error fetching tokens');
    });
  });

  describe('tokenizeCard', () => {
    it('should return tokenized card data on success', async () => {
      const cardDto: CardDto = { number: '4111111111111111', exp_month: '12', exp_year: '30', cvc: '123', card_holder: 'John Doe' };
      const mockResponse = { data: { id: 'tokenized-card-id' } };
      mockHttpService.post.mockReturnValue(of(mockResponse));

      const result = await repository.tokenizeCard(cardDto);

      expect(httpService.post).toHaveBeenCalledWith(
        `${constants.WOMPI_BASE_URL}/tokens/cards`,
        cardDto,
        { headers: { Authorization: `Bearer ${constants.WOMPI_PUBLIC_KEY}` } }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when the request fails', async () => {
      mockHttpService.post.mockReturnValue(of(Promise.reject(new Error('Error tokenizing card'))));

      await expect(repository.tokenizeCard({} as CardDto)).rejects.toThrow('Error tokenizing card');
    });
  });

  describe('createTransaction', () => {
    it('should return transaction data on success', async () => {
      const transactionDto: TransactionDto = { amount_in_cents: 1000, currency: 'COP', payment_method: { type: 'CARD',token:'eeee', installments: 1  },  permalink: 'permalink', acceptance_token: 'acceptance-token', accept_personal_auth: 'personal-auth', customer_email: 'z@.com', signature: 'signature' , reference: 'reference' };
      const mockResponse = { data: { id: 'transaction-id', status: 'success' } };
      mockHttpService.post.mockReturnValue(of(mockResponse));

      const result = await repository.createTransaction(transactionDto);

      expect(httpService.post).toHaveBeenCalledWith(
        `${constants.WOMPI_BASE_URL}/transactions`,
        transactionDto,
        { headers: { Authorization: `Bearer ${constants.WOMPI_PUBLIC_KEY}` } }
      );
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when the request fails', async () => {
      mockHttpService.post.mockReturnValue(of(Promise.reject(new Error('Error creating transaction'))));

      await expect(repository.createTransaction({} as TransactionDto)).rejects.toThrow('Error creating transaction');
    });
  });

  describe('verifyTransaction', () => {
    it('should return transaction verification data on success', async () => {
      const transactionId = 'transaction-id';
      const mockResponse = { data: { id: transactionId, status: 'approved' } };
      mockHttpService.get.mockReturnValue(of(mockResponse));

      const result = await repository.verifyTransaction(transactionId);

      expect(httpService.get).toHaveBeenCalledWith(`${constants.WOMPI_BASE_URL}/transactions/${transactionId}`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should throw an error when the request fails', async () => {
      mockHttpService.get.mockReturnValue(of(Promise.reject(new Error('Error verifying transaction'))));

      await expect(repository.verifyTransaction('transaction-id')).rejects.toThrow('Error verifying transaction');
    });
  });
});
