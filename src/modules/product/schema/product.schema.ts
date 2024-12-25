import { ApiProperty } from '@nestjs/swagger';
import { z } from 'zod';
const CreateProductZodSchema = z.object({
    name: z.string().min(1, "El nombre del producto es obligatorio."),
    description: z.string().optional(),
    price: z.number().min(0, "El precio debe ser mayor o igual a 0."),
    stock: z.number().int().min(0, "El stock debe ser un número entero mayor o igual a 0."),
    image: z.string().optional()
});
class CreateProductDto {
    @ApiProperty({ description: 'Nombre del producto', example: 'Laptop' })
    name: string;

    @ApiProperty({ description: 'Descripción del producto', example: 'Laptop de alta gama', required: false })
    description?: string;

    @ApiProperty({ description: 'Precio unitario', example: 1200.50 })
    price: number;

    @ApiProperty({ description: 'Cantidad en stock', example: 10 })
    stock: number;

    @ApiProperty({ description: 'imagen en url', example: 'https://example.com/image.jpg', required: false })
    image?: string;
}

export { CreateProductDto, CreateProductZodSchema };