import { BeforeAll, AfterAll, Before, After, setDefaultTimeout } from "@cucumber/cucumber";
import { chromium } from "playwright";
import { spawn } from "child_process";

const BASE_URL = "http://localhost:3000";

let browser;
let serverProcess;

setDefaultTimeout(60 * 1000);

async function isServerUp() {
  try {
    const res = await fetch(`${BASE_URL}/api/me`);
    return res.ok;
  } catch {
    return false;
  }
}

async function waitForServer(timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (await isServerUp()) return;
    await new Promise((resolve) => setTimeout(resolve, 300));
  }
  throw new Error("Сервер не поднялся за отведенное время");
}

BeforeAll(async function () {
  browser = await chromium.launch({ headless: true });

  if (!(await isServerUp())) {
    serverProcess = spawn("node", ["server/index.js"], {
      stdio: "inherit",
      env: process.env
    });
    await waitForServer();
  }
});

Before(async function () {
  this.context = await browser.newContext({ baseURL: BASE_URL });
  this.page = await this.context.newPage();
});

After(async function () {
  if (this.context) {
    await this.context.close();
  }
});

AfterAll(async function () {
  if (browser) {
    await browser.close();
  }
  if (serverProcess) {
    serverProcess.kill("SIGTERM");
  }
});
