import { Controller, Post, Body, Patch, Param, HttpException, HttpStatus } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { ZodValidationPipe } from 'nestjs-zod';
import { CreateOrderDto, CreateOrderZodSchema, UpdateOrderDto, UpdateOrderZodSchema } from '../schema/order.schema';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrderResponse, UpdateOrderResponse } from '../docs/order.doc';

@ApiTags('Order')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @ApiOperation({
    summary:
      'Create a new order and payment',
  })
  @ApiOkResponse(OrderResponse)
  @Post()
  async createOrder(
    @Body(new ZodValidationPipe(CreateOrderZodSchema)) dto: CreateOrderDto,
  ) {
    const result = await this.orderService.createOrder(dto);
    if (!result.success) {
      throw new HttpException(result.error, HttpStatus.BAD_REQUEST);
    }
    return { data: result.value };
  }

  @ApiOperation({
    summary:
      'Update an order status and payment',
  })
  @ApiOkResponse(UpdateOrderResponse)
  @Patch(':reference')
  async updateTransaction(
    @Param('reference') reference: string,
    @Body(new ZodValidationPipe(UpdateOrderZodSchema)) updateOrderDto: UpdateOrderDto
  ) {
    const result = await this.orderService.updateOrder(reference,updateOrderDto);
    if (!result.success) {
      throw new HttpException(result.error, result.status || HttpStatus.BAD_REQUEST);
    }
    return { data: result.value };
  }

}
