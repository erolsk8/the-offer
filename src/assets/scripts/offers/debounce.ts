/**
 * Common debounce helper with disabled TS checks.
 */
export function debounce(func: (...args: any[]) => void, wait: number): () => Promise<void> {
  let timeout: number | null = null;
  // eslint-disable-next-line
  return function (...args: any[]): Promise<void> {
    return new Promise((resolve): void => {
      const later = (): void => {
        timeout = null;
        // eslint-disable-next-line
        func(...args);
        resolve();
      };

      if (timeout != null) clearTimeout(timeout);
      // eslint-disable-next-line
      // @ts-ignore
      timeout = setTimeout(later, wait);
    });
  };
}
