import { logError, logResponseError } from './logger';

describe('logger', () => {
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('logError', () => {
    test('logs error with message', () => {
      const errorMessage = 'Test error';
      const errorDetails = { detail: 'Some details' };

      logError(errorMessage, errorDetails);

      expect(consoleSpy).toHaveBeenCalledWith(errorMessage, errorDetails);
    });

    test('logs error without details', () => {
      const errorMessage = 'Oh, no!';

      logError(errorMessage);

      expect(consoleSpy).toHaveBeenCalledWith(errorMessage, '');
    });
  });

  describe('logResponseError', () => {
    test('logs response error with details', () => {
      const mockResponse = new Response(null, {
        status: 404,
        statusText: 'Not Found',
      });
      const message = 'Resource not found';
      const errorDetails = { detail: 'Additional info' };

      logResponseError(mockResponse, message, errorDetails);

      expect(consoleSpy).toHaveBeenCalledWith(`[404] [Not Found] ${message}`, errorDetails);
    });

    test('logs response error without details', () => {
      const mockResponse = new Response(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });
      const message = 'Server error';

      logResponseError(mockResponse, message);

      expect(consoleSpy).toHaveBeenCalledWith(`[500] [Internal Server Error] ${message}`, '');
    });
  });
});
