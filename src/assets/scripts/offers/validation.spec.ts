import { validateAddress } from './validation';

describe('validateAddress', () => {
  test('returns an empty string for a valid address', () => {
    // Valid address with 5 letters, a space, and a number.
    const result = validateAddress('Valid Address 123');
    expect(result).toBe('');
  });

  test('returns an error message for an empty address', () => {
    // Empty address
    const result = validateAddress('');
    expect(result).toBe('Address needs to contain at least 5 letters.');
  });

  test('returns an error message for an address with special characters', () => {
    // Address with special characters - not counted as actual letters
    const result = validateAddress('Addr...@#-/ 123');
    expect(result).toBe('Address needs to contain at least 5 letters.');
  });

  test('returns an error message for an address with fewer than 5 letters', () => {
    // Address with only 4 letters
    const result = validateAddress('Addr1');
    expect(result).toBe('Address needs to contain at least 5 letters.');
  });

  test('returns an error message for an address without a number', () => {
    // Address without a number
    const result = validateAddress('NoNumber Address');
    expect(result).toBe('Address must include a number.');
  });

  test('returns an error message for an address without a space', () => {
    // Address without a space
    const result = validateAddress('NoSpaceAddress1');
    expect(result).toBe('Address must include a space.');
  });
});
