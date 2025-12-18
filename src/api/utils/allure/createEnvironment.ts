import fs from "fs";
import path from "path";

export function createEnvironment() {
    const envFile = path.join(process.cwd(), "allure-results", "environment.properties");
    const content = [
        `BASE_URL=${process.env.BASE_URL}`,
        `ENVIRONMENT=${process.env.ENVIRONMENT}`,
        `TESTER=${process.env.TESTER}`,
        `EXECUTION_TYPE=${process.env.EXECUTION_TYPE}`
    ].join("\n");

    fs.mkdirSync(path.dirname(envFile), { recursive: true });
    fs.writeFileSync(envFile, content);
    console.log("✔ Environment properties created");
}
