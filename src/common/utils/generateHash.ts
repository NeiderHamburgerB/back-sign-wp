import * as crypto from 'crypto';

export function generateIntegrityHash(
  transactionRef: string,
  amount: number,
  currency: string,
  integritySecret: string,
  expirationTime?: string
): string {
  let concatenatedString = `${transactionRef}${amount}${currency}`;

  concatenatedString += `${integritySecret}`;

  const hash = crypto.createHash('sha256');

  hash.update(concatenatedString);

  return hash.digest('hex');
}