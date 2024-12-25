import { ApiProperty } from '@nestjs/swagger';
import { Base } from 'src/common/entities/base.entity';
import {
  Entity,
  Column,
} from 'typeorm';

@Entity({ name: 'products' })
export class Product extends Base {
    @ApiProperty({ description: 'Nombre del producto' })
    @Column()
    name: string;
  
    @ApiProperty({ description: 'Descripción del producto' })
    @Column({ nullable: true })
    description?: string;
  
    @ApiProperty({ description: 'Precio unitario' })
    @Column('decimal', { precision: 10, scale: 2, default: 0 })
    price: number;
  
    @ApiProperty({ description: 'Cantidad en stock' })
    @Column('int', { default: 0 })
    stock: number;

    @ApiProperty({ description: 'imagen en url' })
    @Column('varchar', { length: 255, nullable: true })
    image: string;
}
