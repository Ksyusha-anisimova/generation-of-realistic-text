import test from "node:test";
import assert from "node:assert/strict";
import { generateRealisticText } from "./textGenerator.js";

test("creative модуль генерирует ожидаемую строку", () => {
  const result = generateRealisticText("план релиза", "creative");
  assert.equal(result, "Креативный модуль: план релиза. Текст выглядит реалистично.");
});

test("formal модуль генерирует ожидаемую строку", () => {
  const result = generateRealisticText("техническое задание", "formal");
  assert.equal(result, "Формальный модуль: техническое задание. Текст выверен и нейтрален.");
});

test("пустой запрос вызывает ошибку", () => {
  assert.throws(() => generateRealisticText("   ", "creative"), /Запрос не может быть пустым/);
});

test("неизвестный модуль вызывает ошибку", () => {
  assert.throws(() => generateRealisticText("demo", "unknown"), /Некорректный AI-модуль/);
});
