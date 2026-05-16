import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes (Example backend logic)
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Example of a backend-protected route or proxy if needed
  app.post("/api/verify-company", (req, res) => {
    // In a real app, this would involve server-side validation, 
    // maybe checking business licenses via a 3rd party API.
    const { companyId } = req.body;
    res.json({ success: true, message: `Company ${companyId} verification initiated.` });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`BuildHub Backend running on http://localhost:${PORT}`);
  });
}

startServer();
