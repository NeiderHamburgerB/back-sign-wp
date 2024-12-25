import { Controller, Post, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProductService } from '../services/product.service';
import { PageOptionsDto } from 'src/common/utils/pagination';
import { GetAllProductsResponse } from '../docs/product.docs';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all products paginated',
  })
  @ApiOkResponse(GetAllProductsResponse)
  async getAllProducts(
    @Query() pageOptionsDto: PageOptionsDto
  ) {
    const result = await this.productService.findAll(pageOptionsDto);

    if (!result.success) {
      throw new HttpException(result.error, result.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
     
    return { ...result.value };
  }

  @Post('preload')
  @ApiOperation({
    summary: 'Use this endpoint to preload dummy products, this is useful for testing purposes',
  })
  async preloadProducts() {
    const response = await this.productService.preloadProducts();

    if (!response.success) {
      throw new HttpException(response.error, response.status || HttpStatus.BAD_REQUEST);
    }

    return { data: response.value };
  }
}
