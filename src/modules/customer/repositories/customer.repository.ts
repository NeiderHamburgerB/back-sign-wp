import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { Customer } from '../entities/customer.entity';

@Injectable()
export class CustomerRepository {
  constructor(
    @InjectRepository(Customer)
    private readonly repository: Repository<Customer>,
  ) {}

  public async save(customer: Customer): Promise<Customer> {
    return this.repository.save(customer);
  }

  public async findOneByEmail(email: string): Promise<Customer | null> {
    return this.repository.findOne({ where: { email } });
  }

  public async findOneById(id: number): Promise<Customer | null> {
    return this.repository.findOne({ where: { id } });
  }
}
