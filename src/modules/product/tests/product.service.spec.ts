import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepository } from '../repositories/product.repository';
import { Result } from 'src/common/utils/result';
import { CreateProductDto } from '../schema/product.schema';
import { Product } from '../entities/product.entity';
import { PageDto, PageOptionsDto } from 'src/common/utils/pagination';
import { ErrorProductMessages } from 'src/common/errors/products/products.error';
import { ProductService } from '../services/product.service';

const mockProductRepository = {
  save: jest.fn(),
  findAll: jest.fn(),
  saveBulk: jest.fn(),
};

describe('ProductService', () => {
  let service: ProductService;
  let repository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: ProductRepository,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repository = module.get<ProductRepository>(ProductRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a product successfully', async () => {
      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
      };
      const savedProduct = new Product();
      savedProduct.id = 1;
      savedProduct.name = createProductDto.name;
      savedProduct.description = createProductDto.description;
      savedProduct.price = createProductDto.price;
      savedProduct.stock = createProductDto.stock;

      mockProductRepository.save.mockResolvedValue(savedProduct);

      const result = await service.create(createProductDto);

      expect(repository.save).toHaveBeenCalledWith(expect.any(Product));
      expect(result.success).toBe(true);
      expect(result.value).toEqual(savedProduct);
    });

    it('should return a failure result on error', async () => {
      mockProductRepository.save.mockRejectedValue(new Error('Error saving product'));

      const createProductDto: CreateProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
      };

      const result = await service.create(createProductDto);

      expect(result.success).toBe(false);
      expect(result.error).toBe(ErrorProductMessages.saveError.message);
      expect(result.status).toBe(ErrorProductMessages.saveError.status);
    });
  });

  describe('findAll', () => {
    it('should return a paginated list of products successfully', async () => {
      const pageOptionsDto: PageOptionsDto = { page: 1, take: 10, skip: 0 };
      const mockPageDto: PageDto<Product> = {
        data: [
          { id: 1, name: 'Product 1', description: 'Description 1', price: 100, stock: 10, image: '' },
        ],
        meta: { page: 1, take: 10, total: 1, pageCount: 1, hasPreviousPage: false, hasNextPage: false },
      };

      mockProductRepository.findAll.mockResolvedValue(mockPageDto);

      const result = await service.findAll(pageOptionsDto);

      expect(repository.findAll).toHaveBeenCalledWith(pageOptionsDto);
      expect(result.success).toBe(true);
      expect(result.value).toEqual(mockPageDto);
    });

    it('should return a failure result on error', async () => {
      mockProductRepository.findAll.mockRejectedValue(new Error('Error fetching products'));

      const pageOptionsDto: PageOptionsDto = { page: 1, take: 10, skip: 0 };

      const result = await service.findAll(pageOptionsDto);

      expect(result.success).toBe(false);
      expect(result.error).toBe(ErrorProductMessages.findError.message);
      expect(result.status).toBe(ErrorProductMessages.findError.status);
    });
  });

  describe('preloadProducts', () => {
    it('should preload products successfully', async () => {
      const dummyProducts = [
        { name: 'Product 1', description: 'Description 1', price: 100, stock: 10 },
        { name: 'Product 2', description: 'Description 2', price: 200, stock: 20 },
      ];
      const mockProducts = dummyProducts.map((item) => Object.assign(new Product(), item));

      mockProductRepository.saveBulk.mockResolvedValue(Result.ok(mockProducts));

      const result = await service.preloadProducts();

      expect(repository.saveBulk).toHaveBeenCalledWith(expect.any(Array));
      expect(result.success).toBe(true);
      expect(result.value).toEqual(mockProducts);
    });

    it('should return a failure result on error', async () => {
      mockProductRepository.saveBulk.mockRejectedValue(new Error('Error preloading products'));

      const result = await service.preloadProducts();

      expect(result.success).toBe(false);
      expect(result.error).toBe(ErrorProductMessages.saveError.message);
      expect(result.status).toBe(ErrorProductMessages.saveError.status);
    });
  });
});
