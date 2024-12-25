import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../services/payment.service';
import { HttpException } from '@nestjs/common';
import { CardDto } from '../schema/payment.schema';
import { PaymentController } from '../controllers/payment.controller';

const mockPaymentService = {
    verifyTransaction: jest.fn(),
    getAcceptanceTokens: jest.fn(),
    tokenizeCard: jest.fn(),
};

describe('PaymentController', () => {
    let controller: PaymentController;
    let service: PaymentService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [PaymentController],
            providers: [
                {
                    provide: PaymentService,
                    useValue: mockPaymentService,
                },
            ],
        }).compile();

        controller = module.get<PaymentController>(PaymentController);
        service = module.get<PaymentService>(PaymentService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('verifyTransaction', () => {
        it('should return transaction data on success', async () => {
            const mockResult = { success: true, value: { id: 'transaction-id', status: 'approved' } };
            mockPaymentService.verifyTransaction.mockResolvedValue(mockResult);

            const result = await controller.verifyTransaction('transaction-id');

            expect(service.verifyTransaction).toHaveBeenCalledWith('transaction-id');
            expect(result).toEqual({ data: mockResult.value });
        });

        it('should throw an HttpException on failure', async () => {
            const mockResult = { success: false, error: 'Transaction not found', status: 404 };
            mockPaymentService.verifyTransaction.mockResolvedValue(mockResult);

            await expect(controller.verifyTransaction('invalid-id')).rejects.toThrow(HttpException);
            await expect(controller.verifyTransaction('invalid-id')).rejects.toThrow('Transaction not found');
        });
    });

    describe('getTokens', () => {
        it('should return acceptance tokens on success', async () => {
            const mockResult = {
                success: true,
                value: {
                    acceptanceToken: 'acceptance-token',
                    personalDataAuthToken: 'personal-data-auth-token',
                    permalinkA: 'permalinkA',
                    permalinkB: 'permalinkB',
                },
            };
            mockPaymentService.getAcceptanceTokens.mockResolvedValue(mockResult);

            const result = await controller.getTokens();

            expect(service.getAcceptanceTokens).toHaveBeenCalled();
            expect(result).toEqual({ data: mockResult.value });
        });

        it('should throw an HttpException on failure', async () => {
            const mockResult = { success: false, error: 'Failed to fetch tokens', status: 400 };
            mockPaymentService.getAcceptanceTokens.mockResolvedValue(mockResult);

            await expect(controller.getTokens()).rejects.toThrow(HttpException);
            await expect(controller.getTokens()).rejects.toThrow('Failed to fetch tokens');
        });
    });

    describe('tokenizeCard', () => {
        it('should return a tokenized card on success', async () => {
            const cardDto: CardDto = { number: '4111111111111111', exp_month: '12', exp_year: '30', cvc: '123', card_holder: 'John Doe' };
      
            const mockResult = { success: true, value: 'tokenized-card-id' };
            mockPaymentService.tokenizeCard.mockResolvedValue(mockResult);

            const result = await controller.tokenizeCard(cardDto);

            expect(service.tokenizeCard).toHaveBeenCalledWith(cardDto);
            expect(result).toEqual({ data: mockResult.value });
        });

        it('should throw an HttpException on failure', async () => {
            const cardDto: CardDto = { number: '4111111111111111', exp_month: '12', exp_year: '30', cvc: '123', card_holder: 'John Doe' };

            const mockResult = { success: false, error: 'Invalid card data', status: 400 };
            mockPaymentService.tokenizeCard.mockResolvedValue(mockResult);

            await expect(controller.tokenizeCard(cardDto)).rejects.toThrow(HttpException);
            await expect(controller.tokenizeCard(cardDto)).rejects.toThrow('Invalid card data');
        });
    });
});
