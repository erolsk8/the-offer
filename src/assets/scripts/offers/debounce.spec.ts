import { debounce } from './debounce';

jest.useFakeTimers();

describe('debounce function', () => {
  test('executes provided function only once within the debounce period', async () => {
    const mockFunc = jest.fn();
    const debouncedFunc = debounce(mockFunc, 500);

    // Call the debounced function in quick succession
    void debouncedFunc();
    void debouncedFunc();
    void debouncedFunc();

    // Fast-forward time
    jest.advanceTimersByTime(500);

    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  test('returns a promise that resolves after the function execution', async () => {
    const mockFunc = jest.fn();
    const debouncedFunc = debounce(mockFunc, 500);

    const promise = debouncedFunc();

    // Before the timer, the function should not have been called
    expect(mockFunc).not.toHaveBeenCalled();

    // Fast-forward time
    jest.advanceTimersByTime(500);

    // The function should have been called
    expect(mockFunc).toHaveBeenCalled();

    // The promise should resolve
    await expect(promise).resolves.toBeUndefined();
  });
});
