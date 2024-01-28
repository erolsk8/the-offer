import fetchMock from 'jest-fetch-mock';
import { logError, logResponseError } from './logger';
import { fetchOffers } from './fetch';

jest.mock('./logger', () => ({
  logError: jest.fn(),
  logResponseError: jest.fn(),
}));

// Mock simulateDelay to return immediately, to reduce test execution time
jest.mock('./delay', () => ({
  simulateDelay: jest.fn().mockResolvedValue(undefined),
}));

describe('fetchOffers function', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('successfully fetches offers', async () => {
    const mockOffers = [{ id: '1', name: 'Offer 1', price: 1000, description: 'Test Offer' }];
    fetchMock.mockResponseOnce(JSON.stringify(mockOffers), { headers: { 'Content-Type': 'application/json' } });

    const result = await fetchOffers('Address with 1 offer');

    expect(fetchMock.mock.calls.length).toEqual(1);
    expect(fetchMock.mock.calls[0][0]).toEqual('http://localhost:8000/offers?address=Address%20with%201%20offer');
    expect(result).toEqual({
      success: true,
      data: mockOffers,
    });
  });

  test('successfully fetches empty offers', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]), { headers: { 'Content-Type': 'application/json' } });

    const result = await fetchOffers('Address with 0 offers');

    expect(result).toEqual({
      success: true,
      data: [],
    });
  });

  test('handles invalid content type response', async () => {
    // Mock a response with a non-JSON content type and a text response
    const mockResponse = 'Some error message as text response';
    fetchMock.mockResponseOnce(mockResponse, { headers: { 'Content-Type': 'text/plain' } });

    const result = await fetchOffers('Address 123');

    expect(logResponseError).toHaveBeenCalledWith(
      expect.any(Response),
      'Received invalid response type.',
      expect.objectContaining({ textData: mockResponse }),
    );

    expect(result).toEqual({
      success: false,
      error: 'Your request could not be processed. Please try again later.',
    });
  });

  test('handles response error: INVALID_PARAM', async () => {
    // Mock one of the known error responses
    const mockErrorResponse = {
      code: 'INVALID_PARAM',
      description: "The value of the provided parameter 'address' is too long.",
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockErrorResponse), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await fetchOffers('Address 123');

    expect(logResponseError).toHaveBeenCalledWith(expect.any(Response), 'Response returned error.', mockErrorResponse);

    expect(result).toEqual({
      success: false,
      error: 'Provided address is too long, please try again.',
    });
  });

  test('handles response error: UNKNOWN_PARAM', async () => {
    // Mock one of the known error responses
    const mockErrorResponse = {
      code: 'UNKNOWN_PARAM',
      description: "The provided parameter 'asd' is unknown.",
    };
    fetchMock.mockResponseOnce(JSON.stringify(mockErrorResponse), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });

    const result = await fetchOffers('Address 123');

    expect(logResponseError).toHaveBeenCalledWith(expect.any(Response), 'Response returned error.', mockErrorResponse);

    expect(result).toEqual({
      success: false,
      error: 'Your request could not be processed. Please try again later.',
    });
  });

  test('handles unexpected errors', async () => {
    // Mock fetch to throw an error
    fetchMock.mockReject(new Error('Unexpected error'));

    const result = await fetchOffers('Address 123');

    expect(result).toEqual({
      success: false,
      error: 'Your request could not be processed. Please try again later.',
    });

    expect(logError).toHaveBeenCalledWith('Fetching offers failed.', expect.any(Error));
  });
});
