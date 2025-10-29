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

export default app;
