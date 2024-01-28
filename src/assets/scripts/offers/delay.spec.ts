import { simulateDelay } from './delay';

describe('simulateDelay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('should apply random delay', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.5);

    const promise = simulateDelay();

    // Fast-forward time
    jest.runAllTimers();
    await promise;

    // Check if setTimeout was called correctly
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1500);
  });

  test('should delay for at least 1 second', async () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.1);

    const promise = simulateDelay();

    // Fast-forward time
    jest.runAllTimers();
    await promise;

    // Check if setTimeout was called correctly
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);
  });
});
