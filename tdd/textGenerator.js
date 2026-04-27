const MODULE_TEMPLATES = {
  creative: (prompt) => `Креативный модуль: ${prompt}. Текст выглядит реалистично.`,
  formal: (prompt) => `Формальный модуль: ${prompt}. Текст выверен и нейтрален.`,
  dialog: (prompt) => `Диалоговый модуль: ${prompt}. Ответ звучит как речь человека.`
};

export function generateRealisticText(prompt, moduleName) {
  if (typeof prompt !== "string" || !prompt.trim()) {
    throw new Error("Запрос не может быть пустым");
  }
  if (!MODULE_TEMPLATES[moduleName]) {
    throw new Error("Некорректный AI-модуль");
  }

  return MODULE_TEMPLATES[moduleName](prompt.trim());
}
