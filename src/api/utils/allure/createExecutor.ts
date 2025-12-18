import fs from "fs";
import path from "path";

export function createExecutor() {
    const executorFile = path.join(process.cwd(), "allure-results", "executor.json");
    const content = {
        name: "Playwright API Automation",
        type: "playwright",
        url: process.env.GITHUB_SERVER_URL,
        buildName: process.env.GITHUB_RUN_NUMBER,
        buildUrl: process.env.GITHUB_RUN_ID,
        reportUrl: ""
    };

    fs.mkdirSync(path.dirname(executorFile), { recursive: true });
    fs.writeFileSync(executorFile, JSON.stringify(content, null, 2));
    console.log("✔ Executor info created");
}
