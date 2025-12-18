import fs from "fs";
import path from "path";

export function copyHistory() {
    const src = path.join(process.cwd(), "temp-history"); // artifact download
    const dest = path.join(process.cwd(), "allure-results", "history");

    if (!fs.existsSync(src)) {
        console.log("⚠ No previous history found (first CI run)");
        return;
    }

    fs.mkdirSync(dest, { recursive: true });
    fs.cpSync(src, dest, { recursive: true });
    console.log("✔ Allure history copied successfully");
}
