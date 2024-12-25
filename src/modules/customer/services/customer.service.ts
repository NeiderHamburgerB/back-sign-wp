import { Injectable } from "@nestjs/common";
import { CustomerRepository } from "../repositories/customer.repository";
import { CreateCustomerDto } from "../schemas/customer.schema";
import { Result } from "src/common/utils/result";
import { Customer } from "../entities/customer.entity";
import { ErrorCustomerMessages } from "src/common/errors/customers/customers.error";

@Injectable()
export class CustomerService {
  constructor(
    private readonly repository: CustomerRepository,
  ) {}

  async register(data: CreateCustomerDto): Promise<Result<Customer>> {
    
    const existingCustomer = await this.repository.findOneByEmail(data.email);
    if (existingCustomer) {
      return Result.fail(ErrorCustomerMessages.userExists.message, ErrorCustomerMessages.userExists.status);
    }

    const customer = new Customer();
    customer.firstName = data.firstName;
    customer.email = data.email;

    try {
      const savedCustomer = await this.repository.save(customer);
      return Result.ok(savedCustomer);
    } catch (error) {
      return Result.fail(ErrorCustomerMessages.saveError.message, ErrorCustomerMessages.saveError.status); 
    }
  }

  async findById(id: number): Promise<Result<Customer>> {
    const customer = await this.repository.findOneById(id);
    if (!customer) {
      return Result.fail('Cliente no encontrado', 404);
    }
    return Result.ok(customer);
  }
}
