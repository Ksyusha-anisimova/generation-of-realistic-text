const api = {
  async post(url, data) {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data || {})
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.message || "Ошибка запроса");
    return json;
  },
  async get(url) {
    const res = await fetch(url);
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.message || "Ошибка запроса");
    return json;
  }
};

const els = {
  regUsername: document.getElementById("reg-username"),
  regPassword: document.getElementById("reg-password"),
  regSubmit: document.getElementById("reg-submit"),
  regMsg: document.getElementById("reg-msg"),
  loginUsername: document.getElementById("login-username"),
  loginPassword: document.getElementById("login-password"),
  loginSubmit: document.getElementById("login-submit"),
  loginMsg: document.getElementById("login-msg"),
  authSection: document.getElementById("auth-section"),
  userSection: document.getElementById("user-section"),
  adminSection: document.getElementById("admin-section"),
  userStatus: document.getElementById("user-status"),
  logout: document.getElementById("logout"),
  textPrompt: document.getElementById("text-prompt"),
  textModule: document.getElementById("text-module"),
  textSubmit: document.getElementById("text-submit"),
  textMsg: document.getElementById("text-msg"),
  adminUser: document.getElementById("admin-user"),
  adminRole: document.getElementById("admin-role"),
  adminSubmit: document.getElementById("admin-submit"),
  adminMsg: document.getElementById("admin-msg")
};

function setMsg(el, text, isError = false) {
  el.textContent = text;
  el.classList.toggle("hidden", !text);
  el.style.color = isError ? "#b00020" : "#0a7a2f";
}

function showSection(el, show) {
  el.classList.toggle("hidden", !show);
}

async function refreshMe() {
  const data = await api.get("/api/me");
  const user = data.user;
  if (!user) {
    showSection(els.authSection, true);
    showSection(els.userSection, false);
    showSection(els.adminSection, false);
    return;
  }
  showSection(els.authSection, false);
  showSection(els.userSection, true);
  els.userStatus.textContent = `Вы вошли как ${user.username} (роль: ${user.role})`;
  showSection(els.adminSection, user.role === "admin");
  if (user.role === "admin") {
    await loadUsers();
  }
}

async function loadUsers() {
  const data = await api.get("/api/admin/users");
  els.adminUser.innerHTML = "";
  for (const u of data.users) {
    const opt = document.createElement("option");
    opt.value = u.username;
    opt.textContent = `${u.username} (${u.role})`;
    els.adminUser.appendChild(opt);
  }
}

els.regSubmit.addEventListener("click", async () => {
  setMsg(els.regMsg, "");
  try {
    await api.post("/api/register", {
      username: els.regUsername.value.trim(),
      password: els.regPassword.value.trim()
    });
    setMsg(els.regMsg, "Регистрация успешна");
  } catch (err) {
    setMsg(els.regMsg, err.message, true);
  }
});

els.loginSubmit.addEventListener("click", async () => {
  setMsg(els.loginMsg, "");
  try {
    await api.post("/api/login", {
      username: els.loginUsername.value.trim(),
      password: els.loginPassword.value.trim()
    });
    setMsg(els.loginMsg, "Вход выполнен");
    await refreshMe();
  } catch (err) {
    const errorText = err.message === "Неверный логин или пароль"
      ? "Неверный логин или пароль"
      : err.message;
    setMsg(els.loginMsg, errorText, true);
  }
});

els.logout.addEventListener("click", async () => {
  await api.post("/api/logout");
  await refreshMe();
});

els.textSubmit.addEventListener("click", async () => {
  setMsg(els.textMsg, "");
  try {
    const data = await api.post("/api/text", {
      prompt: els.textPrompt.value,
      moduleName: els.textModule.value
    });
    setMsg(els.textMsg, `Результат: ${data.result}`);
  } catch (err) {
    setMsg(els.textMsg, err.message, true);
  }
});

els.adminSubmit.addEventListener("click", async () => {
  setMsg(els.adminMsg, "");
  try {
    await api.post("/api/admin/role", {
      username: els.adminUser.value,
      role: els.adminRole.value
    });
    setMsg(els.adminMsg, "Роль обновлена");
    await loadUsers();
  } catch (err) {
    setMsg(els.adminMsg, err.message, true);
  }
});

refreshMe().catch(() => {
  // ignore initial errors
});
