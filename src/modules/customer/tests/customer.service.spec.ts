import { Test, TestingModule } from '@nestjs/testing';
import { CustomerRepository } from '../repositories/customer.repository';
import { CreateCustomerDto } from '../schemas/customer.schema';
import { Customer } from '../entities/customer.entity';
import { Result } from 'src/common/utils/result';
import { ErrorCustomerMessages } from 'src/common/errors/customers/customers.error';
import { CustomerService } from '../services/customer.service';

describe('CustomerService', () => {
  let service: CustomerService;
  let repository: CustomerRepository;

  const mockCustomerRepository = {
    save: jest.fn(),
    findOneByEmail: jest.fn(),
    findOneById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerService,
        { provide: CustomerRepository, useValue: mockCustomerRepository },
      ],
    }).compile();

    service = module.get<CustomerService>(CustomerService);
    repository = module.get<CustomerRepository>(CustomerRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a customer successfully', async () => {
      const dto: CreateCustomerDto = {
        firstName: 'John',
        email: 'john@example.com',
      };
      const customer = new Customer();
      Object.assign(customer, dto);
      customer.id = 1;

      jest.spyOn(repository, 'findOneByEmail').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue(customer);

      const result = await service.register(dto);

      expect(repository.findOneByEmail).toHaveBeenCalledWith(dto.email);
      expect(repository.save).toHaveBeenCalledWith(expect.any(Customer));
      expect(result).toEqual(Result.ok(customer));
    });

    it('should return fail if customer already exists', async () => {
      const dto: CreateCustomerDto = { email: 'john@example.com' } as CreateCustomerDto;
      jest.spyOn(repository, 'findOneByEmail').mockResolvedValue({ id: 1 } as Customer);

      const result = await service.register(dto);

      expect(repository.findOneByEmail).toHaveBeenCalledWith(dto.email);
      expect(result).toEqual(Result.fail(ErrorCustomerMessages.userExists.message, 409));
    });
  });

  describe('findById', () => {
    it('should find a customer by ID', async () => {
      const customer = { id: 1, firstName: 'John', email: 'john@example.com' } as Customer;

      jest.spyOn(repository, 'findOneById').mockResolvedValue(customer);

      const result = await service.findById(1);

      expect(repository.findOneById).toHaveBeenCalledWith(1);
      expect(result).toEqual(Result.ok(customer));
    });

    it('should return fail if customer is not found', async () => {
      jest.spyOn(repository, 'findOneById').mockResolvedValue(null);

      const result = await service.findById(1);

      expect(repository.findOneById).toHaveBeenCalledWith(1);
      expect(result).toEqual(Result.fail('Cliente no encontrado', 404));
    });
  });
});
