// utils/testStepHelper.ts
export async function step(description: string, fn: () => Promise<void>) {
  console.log(`TEST STEP : ${description}`);
  await fn();
}
