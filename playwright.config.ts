import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./src/tests",   // <-- make sure this matches where your test files actually are
  timeout: 30000,
  retries: 2,
  reporter: [["list"], ["allure-playwright"]],
  use: {
    baseURL: process.env.BASE_URL || "https://petstore.swagger.io/v2",
    extraHTTPHeaders: {
      "Accept": "application/json",
    },
  },
});
