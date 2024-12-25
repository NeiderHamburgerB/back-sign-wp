import { Injectable, Query } from '@nestjs/common';
import { ProductRepository } from '../repositories/product.repository';
import { Result } from 'src/common/utils/result';
import { Product } from '../entities/product.entity';
import { CreateProductDto } from '../schema/product.schema';
import { PageDto, PageOptionsDto } from 'src/common/utils/pagination';
import { ErrorProductMessages } from 'src/common/errors/products/products.error';

@Injectable()
export class ProductService {
  constructor(private readonly repository: ProductRepository) {}

  async create(body: CreateProductDto): Promise<Result<Product>> {
    try {
      const product = new Product();
      product.name = body.name;
      product.description = body.description;
      product.price = body.price;
      product.stock = body.stock;

      const savedProduct = await this.repository.save(product);
      return Result.ok(savedProduct);
    } catch (error) {
      return Result.fail(ErrorProductMessages.saveError.message, ErrorProductMessages.saveError.status);
    }
  }

  async findAll(@Query() pageOptionsDto: PageOptionsDto): Promise<Result<PageDto<Product>>> {
    try {
      const products = await this.repository.findAll(pageOptionsDto);
      return Result.ok(products);
    } catch (error) {
      return Result.fail(ErrorProductMessages.findError.message, ErrorProductMessages.findError.status);
    }
  }

  async preloadProducts(): Promise<Result<Product[]>> {
    const dummyProducts: Partial<Product>[] = [
      {
        name: 'Laptop ASUS',
        description: 'Laptop ideal para estudiantes y profesionales',
        price: 3800000.00,
        stock: 15,
        image: 'https://example.com/laptop-asus.jpg',
      },
      {
        name: 'Smartphone Samsung Galaxy',
        description: 'Teléfono inteligente con cámara de alta calidad',
        price: 4000000.00,
        stock: 20,
        image: 'https://example.com/smartphone-samsung.jpg',
      },
      {
        name: 'Auriculares Sony WH-1000XM4',
        description: 'Auriculares inalámbricos con cancelación de ruido',
        price: 664000.00,
        stock: 30,
        image: 'https://example.com/auriculares-sony.jpg',
      },
    ];

    const products = dummyProducts.map((item) => {
      const product = new Product();
      product.name = item.name!;
      product.description = item.description;
      product.price = item.price!;
      product.stock = item.stock!;
      product.image = item.image!;
      return product;
    });

    return this.repository.saveBulk(products);
  }

}
