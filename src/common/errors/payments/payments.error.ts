import { HttpStatus } from "@nestjs/common";

export const ErrorPaymentMessages = {
    failedFetchTokens: {
        message: 'Error al obtener los tokens de aceptación',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    failedTokenizeCard: {
        message: 'Error al tokenizar la tarjeta',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    failedVerifyTransaction: {
        message: 'Error al verificar la transacción',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
    }
};
