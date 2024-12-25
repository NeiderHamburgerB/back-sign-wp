import { Test, TestingModule } from '@nestjs/testing';
import { DataSource, Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Order, PageDto, PageMetaDto, PageOptionsDto } from 'src/common/utils/pagination';
import { Result } from 'src/common/utils/result';
import { ErrorProductMessages } from 'src/common/errors/products/products.error';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductRepository } from '../repositories/product.repository';

const mockRepository = {
  save: jest.fn(),
  createQueryBuilder: jest.fn(),
};

const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  manager: {
    save: jest.fn(),
  },
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
};

const mockDataSource = {
  createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
};

describe('ProductRepository', () => {
  let repository: ProductRepository;
  let typeOrmRepository: Repository<Product>;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepository,
        {
          provide: getRepositoryToken(Product),
          useValue: mockRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    repository = module.get<ProductRepository>(ProductRepository);
    typeOrmRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('save', () => {
    it('should save a product successfully', async () => {
      const product = new Product();
      product.name = 'Test Product';

      mockRepository.save.mockResolvedValue(product);

      const result = await repository.save(product);

      expect(typeOrmRepository.save).toHaveBeenCalledWith(product);
      expect(result).toEqual(product);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of products', async () => {
      const pageOptionsDto: PageOptionsDto = { page: 1, take: 10, order: Order.ASC, search: 'Test', skip: 0 };
      const products = [
        { id: '1', name: 'Test Product', price: 100, stock: 10, image: 'url' },
      ];
      const pageMetaDto = new PageMetaDto({ total: 1, pageOptionsDto });
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(1),
        getMany: jest.fn().mockResolvedValue(products),
      };

      mockRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await repository.findAll(pageOptionsDto);

      expect(mockRepository.createQueryBuilder).toHaveBeenCalledWith('product');
      expect(result).toEqual(new PageDto(products, pageMetaDto));
    });
  });

  describe('saveBulk', () => {
    it('should save products in bulk successfully', async () => {
      const products = [
        { name: 'Product 1', price: 100, stock: 10 },
        { name: 'Product 2', price: 200, stock: 20 },
      ];
      const savedProducts = products.map((p) => Object.assign(new Product(), p));

      mockQueryRunner.manager.save.mockResolvedValue(savedProducts);

      const result = await repository.saveBulk(savedProducts);

      expect(mockQueryRunner.connect).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.manager.save).toHaveBeenCalledWith(Product, savedProducts);
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(result.success).toBe(true);
      expect(result.value).toEqual(savedProducts);
    });

    it('should handle errors and rollback on failure', async () => {
      const products = [
        { name: 'Product 1', price: 100, stock: 10 },
        { name: 'Product 2', price: 200, stock: 20 },
      ];

      mockQueryRunner.manager.save.mockRejectedValue(new Error('Error saving products'));

      const result = await repository.saveBulk(products as Product[]);

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(result.success).toBe(false);
      expect(result.error).toBe(ErrorProductMessages.saveError.message);
      expect(result.status).toBe(ErrorProductMessages.saveError.status);
    });
  });
});
