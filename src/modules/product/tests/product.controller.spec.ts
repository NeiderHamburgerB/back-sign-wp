import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../services/product.service';
import { PageOptionsDto } from 'src/common/utils/pagination';
import { HttpException } from '@nestjs/common';
import { ProductController } from '../controllers/product.controller';

const mockProductService = {
  findAll: jest.fn(),
  preloadProducts: jest.fn(),
};

describe('ProductController', () => {
  let controller: ProductController;
  let service: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    service = module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return paginated products on success', async () => {
      const mockResult = {
        success: true,
        value: {
          data: [
            { id: '1', name: 'Product 1', price: 100, stock: 10 },
          ],
          meta: {
            totalItems: 1,
            itemCount: 1,
            itemsPerPage: 10,
            totalPages: 1,
            currentPage: 1,
          },
        },
      };

      mockProductService.findAll.mockResolvedValue(mockResult);

      const pageOptionsDto: PageOptionsDto = { page: 1, take: 10, skip: 0 };
      const result = await controller.getAllProducts(pageOptionsDto);

      expect(service.findAll).toHaveBeenCalledWith(pageOptionsDto);
      expect(result).toEqual(mockResult.value);
    });

    it('should throw an HttpException on failure', async () => {
      const mockResult = { success: false, error: 'Error fetching products', status: 500 };
      mockProductService.findAll.mockResolvedValue(mockResult);

      const pageOptionsDto: PageOptionsDto = { page: 1, take: 10, skip: 0 };

      await expect(controller.getAllProducts(pageOptionsDto)).rejects.toThrow(HttpException);
      await expect(controller.getAllProducts(pageOptionsDto)).rejects.toThrow('Error fetching products');
    });
  });

  describe('preloadProducts', () => {
    it('should preload products successfully', async () => {
      const mockResponse = {
        success: true,
        value: [
          { id: '1', name: 'Product 1', price: 100, stock: 10 },
          { id: '2', name: 'Product 2', price: 200, stock: 20 },
        ],
      };

      mockProductService.preloadProducts.mockResolvedValue(mockResponse);

      const result = await controller.preloadProducts();

      expect(service.preloadProducts).toHaveBeenCalled();
      expect(result).toEqual({ data: mockResponse.value });
    });

    it('should throw an HttpException on failure', async () => {
      const mockResponse = { success: false, error: 'Error preloading products', status: 400 };
      mockProductService.preloadProducts.mockResolvedValue(mockResponse);

      await expect(controller.preloadProducts()).rejects.toThrow(HttpException);
      await expect(controller.preloadProducts()).rejects.toThrow('Error preloading products');
    });
  });
});
