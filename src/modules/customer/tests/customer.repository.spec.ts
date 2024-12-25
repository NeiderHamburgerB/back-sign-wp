import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { Customer } from '../entities/customer.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CustomerRepository } from '../repositories/customer.repository';

describe('CustomerRepository', () => {
  let repository: CustomerRepository;
  let ormRepository: Repository<Customer>;

  const mockOrmRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomerRepository,
        { provide: getRepositoryToken(Customer), useValue: mockOrmRepository },
      ],
    }).compile();

    repository = module.get<CustomerRepository>(CustomerRepository);
    ormRepository = module.get<Repository<Customer>>(getRepositoryToken(Customer));
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('save', () => {
    it('should save a customer', async () => {
      const customer = new Customer();
      mockOrmRepository.save.mockResolvedValue(customer);

      const result = await repository.save(customer);

      expect(mockOrmRepository.save).toHaveBeenCalledWith(customer);
      expect(result).toEqual(customer);
    });
  });

  describe('findOneByEmail', () => {
    it('should find a customer by email', async () => {
      const customer = { id: 1, email: 'john@example.com' } as Customer;

      mockOrmRepository.findOne.mockResolvedValue(customer);

      const result = await repository.findOneByEmail('john@example.com');

      expect(mockOrmRepository.findOne).toHaveBeenCalledWith({ where: { email: 'john@example.com' } });
      expect(result).toEqual(customer);
    });

    it('should return null if no customer is found', async () => {
      mockOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findOneByEmail('notfound@example.com');

      expect(mockOrmRepository.findOne).toHaveBeenCalledWith({ where: { email: 'notfound@example.com' } });
      expect(result).toBeNull();
    });
  });

  describe('findOneById', () => {
    it('should find a customer by id', async () => {
      const customer = { id: 1, email: 'john@example.com' } as Customer;

      mockOrmRepository.findOne.mockResolvedValue(customer);

      const result = await repository.findOneById(1);

      expect(mockOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(customer);
    });

    it('should return null if no customer is found by id', async () => {
      mockOrmRepository.findOne.mockResolvedValue(null);

      const result = await repository.findOneById(99);

      expect(mockOrmRepository.findOne).toHaveBeenCalledWith({ where: { id: 99 } });
      expect(result).toBeNull();
    });
  });
});
