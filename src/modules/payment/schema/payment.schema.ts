import { ApiProperty, ApiPropertyOptional,  } from "@nestjs/swagger";
import { IsEmail, IsNumber, IsObject, IsString, ValidateNested } from "class-validator";
import { PaymentStatus } from "src/common/enums";
import { Type } from "class-transformer";
import { CreatePaymentItemDto, CreatePaymentItemZodSchema } from "./paymentItem.schema";
import { z } from "zod";

/* PaymentDto */
class CreatePaymentDto {
    @ApiProperty()
    amount: number;

    @ApiProperty({ default: 'COP' })
    currency: string;

    @ApiProperty({ enum: PaymentStatus, default: PaymentStatus.PENDING })
    paymentStatus: PaymentStatus;

    @ApiProperty({ required: false })
    datePayment?: Date;

    @ApiProperty({ required: false })
    gatewayTransactionId?: string;

    @ApiProperty({ required: false })
    transactionDate?: Date;

    @ApiProperty({ required: false })
    paymentMethod?: string;

    @ApiProperty({ required: false })
    paymentMethodName?: string;

    @ApiProperty({ required: false })
    operationDate?: Date;

    @ApiProperty({ required: false })
    referenceSale?: string;

    @ApiProperty({ type: () => [CreatePaymentItemDto] })
    items: CreatePaymentItemDto[];
}

const CreatePaymentZodSchema = z.object({
    amount: z.number().min(0),
    currency: z.string().min(1),
    paymentStatus: z.nativeEnum(PaymentStatus).optional(),
    datePayment: z.date().optional(),
    gatewayTransactionId: z.string().optional(),
    transactionDate: z.date().optional(),
    paymentMethod: z.string().optional(),
    paymentMethodName: z.string().optional(),
    operationDate: z.date().optional(),
    referenceSale: z.string().optional(),
    items: z.array(CreatePaymentItemZodSchema),
});

type CreatePaymentDtoZod = z.infer<typeof CreatePaymentZodSchema>;

/* CardDto */

class CardDto {
    @ApiProperty()
    @IsString()
    number: string;
    
    @ApiProperty()
    @IsString()
    cvc: string;

    @ApiProperty()
    @IsString()
    exp_month: string;

    @ApiProperty()
    @IsString()
    exp_year: string;

    @ApiProperty()
    @IsString()
    card_holder: string;
}

const CardDtoSchema = z.object({
    number: z.string(),
    cvc: z.string(),
    exp_month: z.string(),
    exp_year: z.string(),
    card_holder: z.string()
});

class PaymentMethodDto {
    @ApiProperty()
    @IsString()
    type: string;

    @ApiProperty()
    @IsNumber()
    installments: number;

    @ApiProperty()
    @IsString()
    token: string;
}

const PaymentMethodDtoSchema = z.object({
    type: z.string(),
    installments: z.number(),
    token: z.string()
});

class TransactionDto {
    @ApiProperty()
    @IsString()
    acceptance_token: string;

    @ApiProperty()
    @IsString()
    accept_personal_auth: string;
    
    @ApiProperty()
    @IsString()
    permalink: string;

    @ApiProperty()
    @IsNumber()
    amount_in_cents: number;

    @ApiProperty()
    @IsString()
    currency: string;

    @ApiPropertyOptional()
    @IsString()
    signature?: string;

    @ApiProperty()
    @IsEmail()
    customer_email: string;

    @ApiProperty()
    @IsString()
    reference: string;

    @ValidateNested()
    @Type(() => PaymentMethodDto)
    @IsObject()
    payment_method: PaymentMethodDto;
}

const TransactionDtoSchema = z.object({
    acceptance_token: z.string(),
    accept_personal_auth: z.string(),
    permalink: z.string(),
    amount_in_cents: z.number(),
    currency: z.string(),
    signature: z.string().optional(),
    customer_email: z.string().email(),
    reference: z.string(),
    payment_method: PaymentMethodDtoSchema
});


export { CardDto, CreatePaymentDto, TransactionDto, CreatePaymentZodSchema, CreatePaymentDtoZod, TransactionDtoSchema, CardDtoSchema, PaymentMethodDtoSchema };