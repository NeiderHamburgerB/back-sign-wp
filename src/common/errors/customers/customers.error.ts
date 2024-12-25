import { HttpStatus } from "@nestjs/common";

export const ErrorCustomerMessages = {
  userExists: {
    message: 'El cliente ya existe',
    status: HttpStatus.CONFLICT,
  },
  saveError: {
    message: 'Error al guardar el cliente',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
  customerNotFound: {
    message: 'Cliente no encontrado',
    status: HttpStatus.NOT_FOUND,
  },
  findError: {
    message: 'Error al buscar el cliente',
    status: HttpStatus.INTERNAL_SERVER_ERROR,
  },
};
