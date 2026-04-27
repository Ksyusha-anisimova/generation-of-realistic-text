import { Locator, Page } from "@playwright/test";

export class LoginPage {
  readonly page: Page;
  readonly username: Locator;
  readonly password: Locator;
  readonly submit: Locator;
  readonly message: Locator;

  constructor(page: Page) {
    this.page = page;
    this.username = page.locator("#login-username");
    this.password = page.locator("#login-password");
    this.submit = page.locator("#login-submit");
    this.message = page.locator("#login-msg");
  }

  async open() {
    await this.page.goto("/");
  }

  async login(user: string, pass: string) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.submit.click();
  }
}
