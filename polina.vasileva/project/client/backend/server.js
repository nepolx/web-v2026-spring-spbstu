const express = require("express");
const cors = require("cors");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const PORT = 8080;

// ─── Paths to data files ──────────────────────────────────────────────────────
const USERS_FILE  = path.join(__dirname, "data", "users.json");
const GOODS_FILE  = path.join(__dirname, "data", "goods.json");
const ORDERS_FILE = path.join(__dirname, "data", "orders.json");

app.use(cors({ 
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
  credentials: true 
}));
app.use(express.json());

// ─── Simple in-memory session: { sessionId -> userId } ───────────────────────
const sessions = new Map();

const generateSessionId = () =>
  Math.random().toString(36).slice(2) + Date.now().toString(36);

// Middleware: проверка авторизации по заголовку Authorization: Bearer <sessionId>
const requireAuth = (req, res, next) => {
  const header = req.headers["authorization"] ?? "";
  const sessionId = header.replace("Bearer ", "").trim();

  if (!sessionId || !sessions.has(sessionId)) {
    return res.status(401).json({ message: "Необходима авторизация" });
  }

  req.userId = sessions.get(sessionId);
  next();
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
const readJson = async (filePath) => {
  const raw = await fs.readFile(filePath, "utf-8");
  return JSON.parse(raw);
};

const writeJson = async (filePath, data) => {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
};

// ─── Routes ───────────────────────────────────────────────────────────────────

// 1. POST /login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Введите логин и пароль" });
    }

    const users = await readJson(USERS_FILE);
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!user) {
      return res.status(401).json({ message: "Неверный логин или пароль" });
    }

    const sessionId = generateSessionId();
    sessions.set(sessionId, user.id);

    const { password: _, ...safeUser } = user;
    return res.json({ user: safeUser, sessionId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка сервера" });
  }
});

// 2. POST /logout
app.post("/logout", requireAuth, (req, res) => {
  const header = req.headers["authorization"] ?? "";
  const sessionId = header.replace("Bearer ", "").trim();
  sessions.delete(sessionId);
  return res.json({ message: "Выход выполнен" });
});

// 3. GET /goods — список всех товаров (публичный)
app.get("/goods", async (req, res) => {
  try {
    const goods = await readJson(GOODS_FILE);
    return res.json(goods);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка при чтении товаров" });
  }
});

// 4. GET /orders — заказы текущего пользователя
app.get("/orders", requireAuth, async (req, res) => {
  try {
    const orders = await readJson(ORDERS_FILE);
    const userOrders = orders.filter((o) => o.userId === req.userId);
    return res.json(userOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка при чтении заказов" });
  }
});

// 5. POST /orders — создать новый заказ
app.post("/orders", requireAuth, async (req, res) => {
  try {
    const { items, phone, email, delivery, payment, packaging } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Корзина пуста" });
    }

    const orders = await readJson(ORDERS_FILE);

    const newOrder = {
      id: Date.now(),
      userId: req.userId,
      items,        // [{ productId, name, price, qty }]
      phone: phone ?? "",
      email: email ?? "",
      delivery: delivery ?? "pickup",
      payment: payment ?? "",
      packaging: packaging ?? false,
      total: items.reduce((sum, i) => sum + i.price * i.qty, 0),
      createdAt: new Date().toISOString(),
    };

    orders.push(newOrder);
    await writeJson(ORDERS_FILE, orders);

    return res.status(201).json(newOrder);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ошибка при создании заказа" });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Сервер запущен: http://localhost:${PORT}`);
});