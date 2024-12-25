import { Controller, Post, Body, UsePipes, HttpException, HttpStatus } from '@nestjs/common';
import { CreateCustomerDto, CustomerZodSchema } from '../schemas/customer.schema';
import { CustomerService } from '../services/customer.service';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ZodValidationPipe } from 'nestjs-zod';
import { NewCustomerResponse } from '../docs/customer.doc';

@ApiTags('Customer')
@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) { }

  @ApiOperation({
    summary:
      'Create a new customer',
  })
  @ApiOkResponse(NewCustomerResponse)
  @Post()
  @UsePipes(new ZodValidationPipe(CustomerZodSchema))
  async register(@Body() createCustomerDto: CreateCustomerDto) {
    const response = await this.customerService.register(createCustomerDto);

    if (!response.success) {
      throw new HttpException(response.error, response.status || HttpStatus.BAD_REQUEST);
    }

    return { data: response.value };
  }


}
