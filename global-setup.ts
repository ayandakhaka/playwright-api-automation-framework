import fs from "fs";
import path from "path";

export default async function globalSetup() {
  console.log("🔧 Setting up Allure metadata...");

  const prevHistory = path.join(process.cwd(), "allure-history");
  const resultsHistory = path.join(process.cwd(), "allure-results", "history");
  const resultsDir = path.join(process.cwd(), "allure-results");
  const historyDir = path.join(resultsDir, "history");


  // Ensure allure-results exists
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
  }

  // Ensure history folder exists
  if (!fs.existsSync(historyDir)) {
    console.log("📁 Creating empty history folder...");
    fs.mkdirSync(historyDir, { recursive: true });
  }



  // 1️⃣ Copy previous history
  if (fs.existsSync(prevHistory)) {
    fs.mkdirSync(resultsHistory, { recursive: true });
    fs.cpSync(prevHistory, resultsHistory, { recursive: true });
    console.log("✔ Copied previous Allure history");
  } else {
    console.log("⚠ No previous history found (first run)");
  }

  // 2️⃣ Add environment.properties
  const envFile = path.join(process.cwd(), "allure-results", "environment.properties");
  fs.writeFileSync(
    envFile,
    `BASE_URL=${process.env.BASE_URL}\nENVIRONMENT=QA\nEXECUTION_TYPE=LOCAL\nTESTER=Ayanda Khaka`,
    "utf8"
  );
  console.log("✔ Allure environment.properties created");

  // 3️⃣ Add executor.json
  const execFile = path.join(process.cwd(), "allure-results", "executor.json");
  fs.writeFileSync(
    execFile,
    JSON.stringify({
      name: "Playwright API Automation",
      type: "Playwright",
      buildOrder: 1,
      buildName: "Local Run",
      reportName: "Regression Suite",
    }),
    "utf8"
  );
  console.log("✔ Allure executor.json created");

  console.log("✔ Global setup complete. Ready to run tests!");
}
