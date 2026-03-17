import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import Stripe from "stripe";
import cookieParser from "cookie-parser";
import crypto from "crypto";

// Simple CSRF token store (use Redis in production for multi-instance)
const csrfTokens = new Map<string, number>();
const CSRF_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function generateCsrfToken(): string {
  const token = crypto.randomBytes(32).toString('hex');
  csrfTokens.set(token, Date.now());
  return token;
}

function validateCsrfToken(token: string | undefined): boolean {
  if (!token || !csrfTokens.has(token)) return false;
  const issuedAt = csrfTokens.get(token)!;
  if (Date.now() - issuedAt > CSRF_TOKEN_TTL_MS) {
    csrfTokens.delete(token);
    return false;
  }
  csrfTokens.delete(token); // single-use
  return true;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  const stripe = process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY)
    : null;

  app.use(express.json());
  app.use(cookieParser());

  // Issue a CSRF token
  app.get("/api/csrf-token", (req, res) => {
    const token = generateCsrfToken();
    res.json({ csrfToken: token });
  });

  // CSRF validation middleware for state-changing routes
  function csrfProtect(req: express.Request, res: express.Response, next: express.NextFunction) {
    const token = req.headers['x-csrf-token'] as string | undefined;
    if (!validateCsrfToken(token)) {
      return res.status(403).json({ error: 'Invalid or missing CSRF token' });
    }
    next();
  }

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Stripe Checkout Session — protected with CSRF
  app.post("/api/create-checkout-session", csrfProtect, async (req, res) => {
    if (!stripe) {
      return res.status(500).json({ error: "Stripe not configured" });
    }

    const { priceId, userId, email } = req.body;

    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [{ price: priceId, quantity: 1 }],
        mode: "subscription",
        success_url: `${process.env.APP_URL}/?success=true`,
        cancel_url: `${process.env.APP_URL}/?canceled=true`,
        client_reference_id: userId,
        customer_email: email,
      });

      res.json({ id: session.id });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

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
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
