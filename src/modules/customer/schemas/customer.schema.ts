import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { z } from 'zod';

const CustomerZodSchema = z.object({
  firstName: z
    .string({ required_error: 'El nombre es obligatorio' })
    .min(1, 'El nombre no puede estar vacío'),
  email: z
    .string({ required_error: 'El correo electrónico es obligatorio' })
    .email('El correo debe ser válido'),
  payments: z
    .array(z.any())
    .optional(), 
});

class CreateCustomerDto {
  @ApiProperty({ description: 'Nombre del usuario' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  firstName: string;

  @ApiProperty({ description: 'Correo electrónico del usuario' })
  @IsEmail({}, { message: 'Debe proporcionar un correo válido' })
  @IsNotEmpty({ message: 'El correo es obligatorio' })
  email: string;

  @ApiProperty({ description: 'Lista de pagos', required: false, type: [String] })
  @IsArray({ message: 'Los pagos deben ser un arreglo' })
  @IsOptional()
  @Type(() => String)
  payments?: string[]; 
}

export { CreateCustomerDto, CustomerZodSchema };