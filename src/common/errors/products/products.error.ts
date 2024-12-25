import { HttpStatus } from "@nestjs/common";

export const ErrorProductMessages = {
    saveError: {
      message: 'Error al guardar el producto',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
    findError: {
      message: 'Error al buscar productos',
      status: HttpStatus.INTERNAL_SERVER_ERROR,
    },
  };
  