import { Test, TestingModule } from '@nestjs/testing';
import { PaymentRepository } from '../repositories/payment.repository';
import { Result } from 'src/common/utils/result';
import { ErrorPaymentMessages } from 'src/common/errors/payments/payments.error';
import { PaymentService } from '../services/payment.service';

const mockPaymentRepository = {
  fetchAcceptanceTokens: jest.fn(),
  tokenizeCard: jest.fn(),
  verifyTransaction: jest.fn(),
  createTransaction: jest.fn(),
};

describe('PaymentService', () => {
  let service: PaymentService;
  let repository: PaymentRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaymentService,
        {
          provide: PaymentRepository,
          useValue: mockPaymentRepository,
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    repository = module.get<PaymentRepository>(PaymentRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAcceptanceTokens', () => {
    it('should return acceptance tokens on success', async () => {
      const mockResponse = {
        data: {
          presigned_acceptance: {
            acceptance_token: 'acceptance-token',
            permalink: 'permalinkA',
          },
          presigned_personal_data_auth: {
            acceptance_token: 'personal-data-auth-token',
            permalink: 'permalinkB',
          },
        },
      };
      mockPaymentRepository.fetchAcceptanceTokens.mockResolvedValue(mockResponse);

      const result = await service.getAcceptanceTokens();

      expect(result.success).toBe(true);
      expect(result.value).toEqual({
        acceptanceToken: 'acceptance-token',
        personalDataAuthToken: 'personal-data-auth-token',
        permalinkA: 'permalinkA',
        permalinkB: 'permalinkB',
      });
    });

    it('should return a failure result on error', async () => {
      mockPaymentRepository.fetchAcceptanceTokens.mockRejectedValue(new Error('Error fetching tokens'));

      const result = await service.getAcceptanceTokens();

      expect(result.success).toBe(false);
      expect(result.error).toEqual(ErrorPaymentMessages.failedFetchTokens.message);
      expect(result.status).toEqual(ErrorPaymentMessages.failedFetchTokens.status);
    });
  });

  describe('tokenizeCard', () => {
    it('should return a token ID on success', async () => {
      const mockResponse = { data: { id: 'card-token-id' } };
      mockPaymentRepository.tokenizeCard.mockResolvedValue(mockResponse);

      const result = await service.tokenizeCard({} as any);

      expect(result.success).toBe(true);
      expect(result.value).toBe('card-token-id');
    });

    it('should return a failure result on error', async () => {
      mockPaymentRepository.tokenizeCard.mockRejectedValue(new Error('Error tokenizing card'));

      const result = await service.tokenizeCard({} as any);

      expect(result.success).toBe(false);
      expect(result.error).toEqual(ErrorPaymentMessages.failedTokenizeCard.message);
      expect(result.status).toEqual(ErrorPaymentMessages.failedTokenizeCard.status);
    });
  });

  describe('verifyTransaction', () => {
    it('should return transaction info on success', async () => {
      const mockResponse = { data: { id: 'transaction-id', status: 'success' } };
      mockPaymentRepository.verifyTransaction.mockResolvedValue(mockResponse);

      const result = await service.verifyTransaction('transaction-id');

      expect(result.success).toBe(true);
      expect(result.value).toEqual(mockResponse.data);
    });

    it('should return a failure result on error', async () => {
      mockPaymentRepository.verifyTransaction.mockRejectedValue(new Error('Error verifying transaction'));

      const result = await service.verifyTransaction('transaction-id');

      expect(result.success).toBe(false);
      expect(result.error).toEqual(ErrorPaymentMessages.failedVerifyTransaction.message);
      expect(result.status).toEqual(ErrorPaymentMessages.failedVerifyTransaction.status);
    });
  });

  describe('createTransaction', () => {
    it('should return transaction data on success', async () => {
      const mockResponse = { data: { id: 'transaction-id', amount: 100 } };
      mockPaymentRepository.createTransaction.mockResolvedValue(mockResponse);

      const result = await service.createTransaction({} as any);

      expect(result.success).toBe(true);
      expect(result.value).toEqual(mockResponse.data);
    });

    it('should return a failure result on error', async () => {
      mockPaymentRepository.createTransaction.mockRejectedValue(new Error('Error creating transaction'));

      const result = await service.createTransaction({} as any);

      expect(result.success).toBe(false);
      expect(result.error).toBe('Failed to create transaction');
      expect(result.status).toBe(500);
    });
  });

  describe('Error handling scenarios', () => {
    it('should handle repository errors gracefully', async () => {
      mockPaymentRepository.fetchAcceptanceTokens.mockImplementation(() => {
        throw new Error('Unexpected repository error');
      });

      const result = await service.getAcceptanceTokens();

      expect(result.success).toBe(false);
      expect(result.error).toEqual(ErrorPaymentMessages.failedFetchTokens.message);
    });

    it('should log errors when service fails', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      mockPaymentRepository.createTransaction.mockImplementation(() => {
        throw new Error('Critical service error');
      });

      const result = await service.createTransaction({} as any);

      expect(consoleSpy).toHaveBeenCalled();
      expect(result.success).toBe(false);
      consoleSpy.mockRestore();
    });
  });
});
