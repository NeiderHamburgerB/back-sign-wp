import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/entities/base.entity';
import { Payment } from 'src/modules/payment/entities/payment.entity';
import {
    Entity,
    Column,
    OneToMany,
} from 'typeorm';

@Entity({ name: 'customers' })
export class Customer extends Base {
    
    @ApiProperty({ description: 'nombre del usuario' })
    @Column()
    firstName: string;


    @ApiProperty({ description: 'correo del usuario' })
    @Column({ unique: true })
    email: string;
    
    @ApiProperty({ description: 'lista de pagos' })
    @OneToMany(() => Payment, (payment) => payment.customer)
    payments: Payment[];

}
