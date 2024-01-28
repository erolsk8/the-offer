import { messages } from './messages';

/**
 * Get error message if address validation does not meet requirements:
 * - minimum required letters length,
 * - at least one number, and
 * - one space.
 */
export function validateAddress(address: string): string {
  const MIN_ADDRESS_LENGTH = 5;

  // Actual letters (without spaces or special characters)
  const letters = address.match(/\p{L}/gu)?.length ?? 0;
  if (letters < MIN_ADDRESS_LENGTH) {
    return messages.addressErrorLetters.replace('{{min}}', MIN_ADDRESS_LENGTH.toString());
  }

  if (!/\d/.test(address)) {
    return messages.addressErrorNumber;
  }

  if (!/\s/.test(address.trim())) {
    return messages.addressErrorSpace;
  }

  // Empty string indicates a valid address
  return '';
}
