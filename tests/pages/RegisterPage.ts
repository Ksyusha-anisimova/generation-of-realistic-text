import { Locator, Page } from "@playwright/test";

export class RegisterPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly message: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.locator("#reg-username");
    this.password = page.locator("#reg-password");
    this.submit = page.locator("#reg-submit");
    this.message = page.locator("#reg-msg");
  }

  async register(user: string, pass: string) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.submit.click();
  }
}
