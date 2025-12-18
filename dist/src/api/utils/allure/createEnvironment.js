import * as fs from "fs";
import * as path from "path";
export function createEnvironment() {
    const resultsPath = path.join(process.cwd(), "allure-results");
    if (!fs.existsSync(resultsPath)) {
        fs.mkdirSync(resultsPath);
    }
    const content = `BASE_URL=${process.env.BASE_URL}\n` +
        `ENVIRONMENT=${process.env.ENV}\n` +
        `OS=${process.platform}\n` +
        `API_VERSION=v1\n`;
    fs.writeFileSync(path.join(resultsPath, "environment.properties"), content);
    console.log("✔ Allure environment.properties generated");
}
