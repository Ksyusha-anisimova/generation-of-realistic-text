import { Locator, Page } from "@playwright/test";

export class DashboardPage {
  readonly page: Page;
  readonly status: Locator;
  readonly logout: Locator;
  readonly textPrompt: Locator;
  readonly textSubmit: Locator;
  readonly textMsg: Locator;

  constructor(page: Page) {
    this.page = page;
    this.status = page.locator("#user-status");
    this.logout = page.locator("#logout");
    this.textPrompt = page.locator("#text-prompt");
    this.textSubmit = page.locator("#text-submit");
    this.textMsg = page.locator("#text-msg");
  }

  async isVisible() {
    return this.status.isVisible();
  }

  async generate(prompt: string) {
    await this.textPrompt.fill(prompt);
    await this.textSubmit.click();
  }
}
