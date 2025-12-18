// utils/testStepHelper.ts
export async function step(description, fn) {
    console.log(`TEST STEP : ${description}`);
    await fn();
}
