enum TransactionStatusMessage {
  APPROVED = 'Transacción aprobada',
  DECLINED = 'Transacción rechazada',
  PENDING = 'Transacción pendiente',
  ERROR = 'Error procesando la transacción',
  VOIDED = 'Error desconocido',
}

enum TransactionStatus {
  APPROVED = 'APPROVED',
  DECLINED = 'DECLINED',
  PENDING = 'PENDING',
  ERROR = 'ERROR',
  VOIDED = 'VOIDED',
}

enum PaymentStatus {
  APPROVED = 'APPROVED',
  PENDING = 'PENDING',
  ERROR = 'ERROR',
}

export { TransactionStatusMessage, TransactionStatus, PaymentStatus };
