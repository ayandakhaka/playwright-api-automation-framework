import nodemailer from "nodemailer";
import fs from "fs";

const {
  GMAIL_USER,
  GMAIL_PASS,
  EMAIL_TO,
  GITHUB_SERVER_URL,
  GITHUB_REPOSITORY,
  GITHUB_RUN_ID,
} = process.env;

if (!GMAIL_USER || !GMAIL_PASS || !EMAIL_TO) {
  console.error("Missing required email environment variables");
  process.exit(1);
}

async function sendEmail() {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: GMAIL_USER,
      pass: GMAIL_PASS,
    },
  });

  const runUrl = `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`;

  const summaryPath = "test-results/summary.txt";
  const summary = fs.existsSync(summaryPath)
    ? fs.readFileSync(summaryPath, "utf8")
    : "Pipeline execution completed. See GitHub Actions for details.";

  const attachments = [];
  if (fs.existsSync("allure-report.zip")) {
    attachments.push({
      filename: "allure-report.zip",
      path: "allure-report.zip",
    });
  }

  await transporter.sendMail({
    from: `"GitHub Actions" <${GMAIL_USER}>`,
    to: EMAIL_TO,
    subject: "CI Pipeline Test Results",
    text: `${summary}\n\nView run details:\n${runUrl}`,
    attachments,
  });

  console.log("Email sent successfully");
}

sendEmail().catch((error) => {
  console.error("Failed to send email:", error);
  process.exit(1);
});
