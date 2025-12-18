import * as fs from "fs";
import * as path from "path";
export function copyHistory() {
    const historySrc = path.join(process.cwd(), "allure-report", "history");
    const historyDest = path.join(process.cwd(), "allure-results", "history");
    if (fs.existsSync(historySrc)) {
        fs.mkdirSync(historyDest, { recursive: true });
        for (const file of fs.readdirSync(historySrc)) {
            fs.copyFileSync(path.join(historySrc, file), path.join(historyDest, file));
        }
        console.log("✔ Allure history copied to allure-results/history");
    }
    else {
        console.log("⚠ No history found, first run");
    }
}
