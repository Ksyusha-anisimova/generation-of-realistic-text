import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/specs",
  use: {
    baseURL: "http://localhost:3000",
    headless: true
  },
  webServer: {
    command: "npm run start",
    url: "http://localhost:3000",
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
});
