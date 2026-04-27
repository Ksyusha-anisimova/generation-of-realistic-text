import assert from "assert/strict";
import { Given, When, Then } from "@cucumber/cucumber";

Given("пользователь находится на странице авторизации", async function () {
  await this.page.goto("/");
});

When(
  "пользователь входит с логином {string} и паролем {string}",
  async function (username, password) {
    await this.page.locator("#login-username").fill(username);
    await this.page.locator("#login-password").fill(password);
    await this.page.locator("#login-submit").click();
  }
);

Then("система показывает статус {string}", async function (expectedText) {
  const status = this.page.locator("#user-status");
  await status.waitFor({ state: "visible" });
  const text = (await status.textContent()) || "";
  assert.ok(text.includes(expectedText), `Ожидался текст '${expectedText}', получено '${text}'`);
});

Then("система показывает сообщение входа {string}", async function (expectedError) {
  const message = this.page.locator("#login-msg");
  await message.waitFor({ state: "visible" });
  const text = (await message.textContent()) || "";
  assert.ok(text.includes(expectedError), `Ожидалась ошибка '${expectedError}', получено '${text}'`);
});

When(
  "пользователь регистрируется с уникальным логином и паролем {string}",
  async function (password) {
    const random = Math.random().toString(36).slice(2, 8);
    const username = `bdd_user_${random}`;

    this.createdUsername = username;
    this.createdPassword = password;

    await this.page.locator("#reg-username").fill(username);
    await this.page.locator("#reg-password").fill(password);
    await this.page.locator("#reg-submit").click();

    const regMsg = this.page.locator("#reg-msg");
    await regMsg.waitFor({ state: "visible" });
    const regText = (await regMsg.textContent()) || "";
    assert.ok(regText.includes("Регистрация успешна"), `Не удалось зарегистрироваться: '${regText}'`);
  }
);

When("пользователь входит с зарегистрированными данными", async function () {
  assert.ok(this.createdUsername, "Не сохранен созданный логин");
  assert.ok(this.createdPassword, "Не сохранен созданный пароль");

  await this.page.locator("#login-username").fill(this.createdUsername);
  await this.page.locator("#login-password").fill(this.createdPassword);
  await this.page.locator("#login-submit").click();
});

Then("система показывает статус для нового пользователя", async function () {
  const status = this.page.locator("#user-status");
  await status.waitFor({ state: "visible" });
  const text = (await status.textContent()) || "";
  assert.ok(
    text.includes(`Вы вошли как ${this.createdUsername}`),
    `Ожидался пользователь '${this.createdUsername}', получено '${text}'`
  );
});

Given("администратор авторизован в системе", async function () {
  await this.page.goto("/");
  await this.page.locator("#login-username").fill("admin");
  await this.page.locator("#login-password").fill("Admin123");
  await this.page.locator("#login-submit").click();

  const adminButton = this.page.locator("#admin-submit");
  await adminButton.waitFor({ state: "visible" });
});

When(
  "администратор меняет роль пользователя {string} на {string}",
  async function (username, role) {
    await this.page.locator("#admin-user").selectOption(username);
    await this.page.locator("#admin-role").selectOption(role);
    await this.page.locator("#admin-submit").click();
  }
);

Then("система показывает сообщение администратора {string}", async function (expectedText) {
  const msg = this.page.locator("#admin-msg");
  await msg.waitFor({ state: "visible" });
  const text = (await msg.textContent()) || "";
  assert.ok(text.includes(expectedText), `Ожидалось '${expectedText}', получено '${text}'`);
});

Given("пользователь {string} с паролем {string} авторизован", async function (username, password) {
  await this.page.goto("/");
  await this.page.locator("#login-username").fill(username);
  await this.page.locator("#login-password").fill(password);
  await this.page.locator("#login-submit").click();

  const status = this.page.locator("#user-status");
  await status.waitFor({ state: "visible" });
});

When(
  "пользователь генерирует текст по запросу {string} через модуль {string}",
  async function (prompt, moduleName) {
    await this.page.locator("#text-prompt").fill(prompt);
    await this.page.locator("#text-module").selectOption(moduleName);
    await this.page.locator("#text-submit").click();
  }
);

Then("система показывает результат генерации {string}", async function (expectedResult) {
  const msg = this.page.locator("#text-msg");
  await msg.waitFor({ state: "visible" });
  const text = (await msg.textContent()) || "";
  assert.ok(
    text.includes(`Результат: ${expectedResult}`),
    `Ожидался результат '${expectedResult}', получено '${text}'`
  );
});
