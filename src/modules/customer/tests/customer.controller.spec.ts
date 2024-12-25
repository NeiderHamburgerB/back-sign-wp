import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../schemas/customer.schema';
import { Result } from 'src/common/utils/result';
import { CustomerController } from '../controllers/customer.controller';
import { Customer } from '../entities/customer.entity';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  const mockCustomerService = {
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        { provide: CustomerService, useValue: mockCustomerService },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('register', () => {
    it('should register a customer successfully', async () => {
      const dto: CreateCustomerDto = {
        firstName: 'John',
        email: 'john@example.com',
      };
      const result = Result.ok({
        id: 1,
        firstName: 'John',
        email: 'john@example.com',
        payments: [],
      });

      jest.spyOn(service, 'register').mockResolvedValue(result);

      const response = await controller.register(dto);

      expect(service.register).toHaveBeenCalledWith(dto);
      expect(response).toEqual({ data: result.value });
    });

    it('should throw an exception if service fails', async () => {
      const dto: CreateCustomerDto = {
        firstName: 'John',
        email: 'john@example.com',
      };
    
      // Especificar el tipo de Result como Result<Customer>
      const errorResult: Result<Customer> = Result.fail('Error', 400);
    
      jest.spyOn(service, 'register').mockResolvedValue(errorResult);
    
      await expect(controller.register(dto)).rejects.toThrow('Error');
      expect(service.register).toHaveBeenCalledWith(dto);
    });
  });
});
