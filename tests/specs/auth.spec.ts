import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { DashboardPage } from "../pages/DashboardPage";

function uniqueUser() {
  const rnd = Math.random().toString(36).slice(2, 8);
  return `user_${rnd}`;
}

test("Успешная авторизация существующего пользователя", async ({ page }) => {
  const login = new LoginPage(page);
  const dashboard = new DashboardPage(page);
  await login.open();
  await login.login("user1", "User1234");
  await expect(dashboard.status).toContainText("Вы вошли как user1");
});

test("Неверный пароль вызывает ошибку", async ({ page }) => {
  const login = new LoginPage(page);
  await login.open();
  await login.login("user1", "WrongPassword");
  await expect(login.message).toContainText("Неверный логин или пароль");
});

test("Регистрация нового пользователя и вход", async ({ page }) => {
  const login = new LoginPage(page);
  const register = new RegisterPage(page);
  const dashboard = new DashboardPage(page);
  const user = uniqueUser();
  const pass = "Pass1234";

  await login.open();
  await register.register(user, pass);
  await expect(register.message).toContainText("Регистрация успешна");

  await login.login(user, pass);
  await expect(dashboard.status).toContainText(`Вы вошли как ${user}`);
});
