import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Product } from '../entities/product.entity';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/common/utils/pagination';
import { Result } from 'src/common/utils/result';
import { ErrorProductMessages } from 'src/common/errors/products/products.error';

@Injectable()
export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly repository: Repository<Product>,
    private readonly dataSource: DataSource,
  ) {}

  public async save(product: Product): Promise<Product> {
    return this.repository.save(product);
  }

  public async findAll(
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Product>> {
    const queryBuilder = this.repository.createQueryBuilder('product');
    console.log('pageOptionsDto', pageOptionsDto);
    queryBuilder
      .select(['product.id', 'product.name', 'product.price', 'product.stock', 'product.image'])
      .orderBy('product.name', pageOptionsDto.order)
      .skip((pageOptionsDto.page - 1) * pageOptionsDto.take)
      .take(pageOptionsDto.take);

    if (pageOptionsDto.search) {
      queryBuilder.andWhere(
        'LOWER(product.name) LIKE LOWER(:search) OR LOWER(product.description) LIKE LOWER(:search)',
        { search: `%${pageOptionsDto.search}%` },
      );
    }

    const total = await queryBuilder.getCount();
    const products = await queryBuilder.getMany();

    const pageMetaDto = new PageMetaDto({ total, pageOptionsDto });

    return new PageDto(products, pageMetaDto);
  }

  async saveBulk(products: Product[]): Promise<Result<Product[]>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const savedProducts = await queryRunner.manager.save(Product, products);
      await queryRunner.commitTransaction();
      return Result.ok(savedProducts);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return Result.fail(
        ErrorProductMessages.saveError.message,
        ErrorProductMessages.saveError.status,
      );
    } finally {
      await queryRunner.release();
    }
  }

}
