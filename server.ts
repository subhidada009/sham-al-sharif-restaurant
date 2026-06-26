import express from "express";
import path from "path";
import fs from "fs/promises";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), "data.json");

app.use(express.json({ limit: "50mb" }));

// Load data
async function loadData() {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return { products: [], backgroundImage: null, headerBackgroundImage: null, logo: null };
  }
}

// Save data
async function saveData(data: any) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

// Ensure file exists
async function initData() {
  try {
    await fs.access(DATA_FILE);
  } catch {
    await saveData({ products: [], backgroundImage: null, headerBackgroundImage: null, logo: null });
  }
}
initData();

// API Routes
app.get("/api/data", async (req, res) => {
  const data = await loadData();
  res.json(data);
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin") {
    res.json({ success: true, token: "fake-admin-token" });
  } else {
    res.status(401).json({ success: false, message: "Invalid credentials" });
  }
});

// Middleware to check fake token
function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (authHeader === "Bearer fake-admin-token") {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

app.post("/api/settings", requireAuth, async (req, res) => {
  const { backgroundImage, headerBackgroundImage, logo } = req.body;
  const data = await loadData();
  if (backgroundImage !== undefined) data.backgroundImage = backgroundImage;
  if (headerBackgroundImage !== undefined) data.headerBackgroundImage = headerBackgroundImage;
  if (logo !== undefined) data.logo = logo;
  await saveData(data);
  res.json({ success: true });
});

app.post("/api/products", requireAuth, async (req, res) => {
  const { product } = req.body;
  const data = await loadData();
  const newProduct = { ...product, id: `p_${Date.now()}` };
  data.products.push(newProduct);
  await saveData(data);
  res.json({ success: true, product: newProduct });
});

app.put("/api/products/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const { product } = req.body;
  const data = await loadData();
  const index = data.products.findIndex((p: any) => p.id === id);
  if (index !== -1) {
    data.products[index] = { ...data.products[index], ...product };
    await saveData(data);
    res.json({ success: true, product: data.products[index] });
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

app.delete("/api/products/:id", requireAuth, async (req, res) => {
  const { id } = req.params;
  const data = await loadData();
  data.products = data.products.filter((p: any) => p.id !== id);
  await saveData(data);
  res.json({ success: true });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
