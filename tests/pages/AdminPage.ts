import { Locator, Page } from "@playwright/test";

export class AdminPage {
  readonly page: Page;
  readonly userSelect: Locator;
  readonly roleSelect: Locator;
  readonly submit: Locator;
  readonly message: Locator;

  constructor(page: Page) {
    this.page = page;
    this.userSelect = page.locator("#admin-user");
    this.roleSelect = page.locator("#admin-role");
    this.submit = page.locator("#admin-submit");
    this.message = page.locator("#admin-msg");
  }

  async changeRole(username: string, role: "user" | "admin") {
    await this.userSelect.selectOption(username);
    await this.roleSelect.selectOption(role);
    await this.submit.click();
  }
}
