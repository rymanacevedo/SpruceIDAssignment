import { randomBytes } from "crypto";
import { Hono } from "hono";

const app = new Hono();

const nonceStore = new Set<string>();

app.get("/nonce", (c) => {
	const token = randomBytes(16).toString("hex");
	const expiration = Date.now() + 5 * 60 * 1000; // 5 minutes from now

	nonceStore.add(token);

	setTimeout(() => {
		nonceStore.delete(token);
	}, expiration - Date.now());

	console.log(`Token issued: ${token}`);

	return c.json({ token });
});

app.post("/verify", async (c) => {
	const { token } = await c.req.json();

	if (!nonceStore.has(token)) {
		return c.json({ valid: false }, 400);
	}

	nonceStore.delete(token);
	console.log(`Token verified and removed: ${token}`);

	return c.json({ valid: true });
});

export default app;
