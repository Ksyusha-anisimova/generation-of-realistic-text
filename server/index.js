import express from "express";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";
import { generateRealisticText } from "../tdd/textGenerator.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

const users = new Map();
const sessions = new Map();

function seedUsers() {
  users.set("admin", { username: "admin", password: "Admin123", role: "admin" });
  users.set("user1", { username: "user1", password: "User1234", role: "user" });
}

seedUsers();

function parseCookies(req) {
  const header = req.headers.cookie || "";
  const pairs = header.split(";").map((c) => c.trim()).filter(Boolean);
  const cookies = {};
  for (const pair of pairs) {
    const idx = pair.indexOf("=");
    if (idx === -1) continue;
    const key = pair.slice(0, idx);
    const val = pair.slice(idx + 1);
    cookies[key] = decodeURIComponent(val);
  }
  return cookies;
}

function createSession(username) {
  const sessionId = crypto.randomBytes(16).toString("hex");
  sessions.set(sessionId, username);
  return sessionId;
}

function getCurrentUser(req) {
  const cookies = parseCookies(req);
  const sessionId = cookies.sid;
  if (!sessionId) return null;
  const username = sessions.get(sessionId);
  if (!username) return null;
  return users.get(username) || null;
}

function requireAuth(req, res, next) {
  const user = getCurrentUser(req);
  if (!user) {
    return res.status(401).json({ ok: false, message: "Необходима авторизация" });
  }
  req.user = user;
  next();
}

function requireAdmin(req, res, next) {
  const user = getCurrentUser(req);
  if (!user || user.role !== "admin") {
    return res.status(401).json({ ok: false, message: "Требуется роль администратора" });
  }
  req.user = user;
  next();
}

app.get("/api/me", (req, res) => {
  const user = getCurrentUser(req);
  if (!user) return res.json({ ok: true, user: null });
  return res.json({ ok: true, user: { username: user.username, role: user.role } });
});

app.post("/api/register", (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ ok: false, message: "Логин и пароль обязательны" });
  }
  if (users.has(username)) {
    return res.status(400).json({ ok: false, message: "Такой пользователь уже существует" });
  }
  users.set(username, { username, password, role: "user" });
  return res.json({ ok: true });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body || {};
  const user = users.get(username);
  if (!user || user.password !== password) {
    return res.status(400).json({ ok: false, message: "Неверный логин или пароль" });
  }
  const sessionId = createSession(user.username);
  res.setHeader(
    "Set-Cookie",
    `sid=${encodeURIComponent(sessionId)}; HttpOnly; Path=/; SameSite=Lax`
  );
  return res.json({ ok: true, user: { username: user.username, role: user.role } });
});

app.post("/api/logout", (req, res) => {
  const cookies = parseCookies(req);
  if (cookies.sid) sessions.delete(cookies.sid);
  res.setHeader("Set-Cookie", "sid=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax");
  return res.json({ ok: true });
});

app.get("/api/admin/users", requireAdmin, (req, res) => {
  const list = Array.from(users.values()).map((u) => ({ username: u.username, role: u.role }));
  return res.json({ ok: true, users: list });
});

app.post("/api/admin/role", requireAdmin, (req, res) => {
  const { username, role } = req.body || {};
  if (!username || !role) {
    return res.status(400).json({ ok: false, message: "Нужны username и role" });
  }
  if (!users.has(username)) {
    return res.status(404).json({ ok: false, message: "Пользователь не найден" });
  }
  if (role !== "user" && role !== "admin") {
    return res.status(400).json({ ok: false, message: "Некорректная роль" });
  }
  const user = users.get(username);
  user.role = role;
  users.set(username, user);
  return res.json({ ok: true });
});

app.post("/api/text", requireAuth, (req, res) => {
  try {
    const { prompt, moduleName } = req.body || {};
    const result = generateRealisticText(prompt, moduleName);
    return res.json({ ok: true, result });
  } catch (err) {
    return res.status(400).json({ ok: false, message: err.message || "Ошибка генерации" });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
