import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { PaymentStatus } from "src/common/enums";
import { CreatePaymentDto, CreatePaymentZodSchema } from "src/modules/payment/schema/payment.schema";
import { CreateProductDto } from "src/modules/product/schema/product.schema";
import { z } from "zod";

class CreateOrderDto {
    @ApiProperty()
    @IsNotEmpty()
    address: string;

    @ApiProperty()
    @IsNotEmpty()
    city: string;

    @ApiProperty()
    @IsNotEmpty()
    phone: string;

    @ApiProperty()
    @IsNotEmpty()
    email?: string;

    @ApiProperty()
    @IsNotEmpty()
    firstName?: string;

    @ApiPropertyOptional({ default: 'PENDING' })
    status?: string;

    @ApiPropertyOptional({ description: 'Datos del pago asociado a esta orden' })
    payment?: CreatePaymentDto;

    @ApiProperty()
    @IsNotEmpty()
    cardToken?: string;

    @ApiProperty()
    @IsNotEmpty()
    acceptanceToken?: string;

    @ApiProperty()
    @IsNotEmpty()
    personalDataAuthToken?: string;

    @ApiProperty()
    @IsNotEmpty()
    quotas?: string;
    
}

const CreateOrderZodSchema = z.object({
    address: z.string().min(1),
    city: z.string().optional(),
    phone: z.string().optional(),
    status: z.string().optional(), 
    payment: CreatePaymentZodSchema,
    cardToken: z.string().optional(),
    acceptanceToken: z.string().optional(),
    personalDataAuthToken: z.string().optional(),
    quotas: z.string().optional(),
    email: z.string().optional(),
    firstName: z.string().optional(),
});

type CreateOrderDtoZod = z.infer<typeof CreateOrderZodSchema>;

class UpdateOrderDto {
    @ApiProperty()
    @IsNotEmpty()
    @IsEnum(PaymentStatus)
    status: any; // Estado de la transacción, ej: "APPROVED"
    @ApiProperty()
    @IsNotEmpty()
    id: string; // ID único de la transacción
    @ApiProperty()
    @IsNotEmpty()
    methodName: string; // Nombre del método de pago, ej: "VISA"
    @ApiProperty()
    @IsNotEmpty()
    finalizedAt: string; // Fecha y hora de finalización, formato ISO-8601
}
const UpdateOrderZodSchema = z.object({
    status: z.string().nonempty({ message: 'El estado es obligatorio' }), // No puede estar vacío
    id: z.string().nonempty({ message: 'El ID es obligatorio' }), // No puede estar vacío
    methodName: z.string().nonempty({ message: 'El nombre del método de pago es obligatorio' }), // No puede estar vacío
    finalizedAt: z
      .string()
      .nonempty({ message: 'La fecha de finalización es obligatoria' })
      .refine((date) => !isNaN(Date.parse(date)), {
        message: 'La fecha de finalización debe estar en formato ISO-8601 válido',
      }),
  })
export {
    CreateOrderDto,
    CreateOrderZodSchema,
    CreateOrderDtoZod,
    UpdateOrderDto,
    UpdateOrderZodSchema
}