import { HttpStatus } from "@nestjs/common";

export const ErrorOrderMessages = {
    successUpdatedOrder: {
        message: 'La orden ha sido actualizada con éxito',
        status: HttpStatus.OK,
    },
    failedUpdateOrder: {
        message: 'Error al actualizar la orden',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    failedCreateOrder: {
        message: 'Error al crear la orden',
        status: HttpStatus.INTERNAL_SERVER_ERROR,
    }
};
