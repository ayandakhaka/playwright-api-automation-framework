import * as fs from "fs";
import * as path from "path";
export function createExecutor() {
    const resultsPath = path.join(process.cwd(), "allure-results");
    const executorData = {
        name: "GitHub Actions",
        type: "github",
        url: process.env.GITHUB_SERVER_URL || "https://github.com",
        buildOrder: process.env.GITHUB_RUN_NUMBER || "1",
        buildUrl: process.env.GITHUB_RUN_ID
            ? `${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
            : "local-run",
        reportUrl: "",
        buildName: process.env.GITHUB_JOB || "local-run",
        buildId: process.env.GITHUB_RUN_ID || "local",
    };
    fs.writeFileSync(path.join(resultsPath, "executor.json"), JSON.stringify(executorData, null, 2));
    console.log("✔ Allure executor.json generated");
}
