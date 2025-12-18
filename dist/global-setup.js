import dotenv from "dotenv";
dotenv.config();
// ✅ Node16 ESM requires explicit file extensions
import createEnvironment from "../src/utils/allure/createEnvironment.js";
import { createExecutor } from "../src/utils/allure/createExecutor.js";
import { copyHistory } from "../src/utils/allure/copyHistory.js";
/**
 * Global setup for Playwright tests.
 * - Restores Allure history for trends
 * - Generates environment.properties
 * - Creates executor.json
 */
async function globalSetup() {
    console.log("🔧 Generating Allure metadata...");
    try {
        copyHistory(); // restores previous allure-results/history
        createEnvironment(); // creates environment.properties
        createExecutor(); // creates executor.json
        console.log("✔ All pre-test setup complete");
    }
    catch (error) {
        console.error("❌ Error during global setup:", error);
        throw error; // fail CI if setup fails
    }
}
// Node16+ ESM export
export default globalSetup;
