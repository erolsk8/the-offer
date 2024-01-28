/**
 * Simple random delay, 1 to 3 seconds.
 */
export async function simulateDelay(): Promise<void> {
  const delay = Math.max(1000, Math.random() * 3000);
  await new Promise((resolve) => setTimeout(resolve, delay));
}
