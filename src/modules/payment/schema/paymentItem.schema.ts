import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { z } from 'zod';

class CreatePaymentItemDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    productId: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    quantity: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    unitPrice: number;
}

const CreatePaymentItemZodSchema = z.object({
    productId: z.number().min(1),
    quantity: z.number().int().min(1),
    unitPrice: z.number().min(0),
});

type CreatePaymentItemDtoZod = z.infer<typeof CreatePaymentItemZodSchema>;

export {
    CreatePaymentItemDto,
    CreatePaymentItemZodSchema,
    CreatePaymentItemDtoZod,    
}