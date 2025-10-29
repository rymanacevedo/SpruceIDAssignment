import { createDecipheriv, createSign, generateKeyPairSync } from "crypto";

type TokenResponse = {
	token: string;
};

type KeyPair = {
	publicKey: string;
	privateKey: string;
};

function generateKeyPair(): KeyPair {
	const { publicKey, privateKey } = generateKeyPairSync("rsa", {
		modulusLength: 2048,
		publicKeyEncoding: {
			type: "spki",
			format: "pem",
		},
		privateKeyEncoding: {
			type: "pkcs8",
			format: "pem",
			cipher: "aes-256-cbc",
			passphrase: "your-passphrase",
		},
	});

	return { publicKey, privateKey };
}

function decryptKey(passphrase: string, encryptedKey: string): string {
	const decipher = createDecipheriv(
		"aes-256-cbc",
		Buffer.from(passphrase),
		Buffer.alloc(16, 0),
	);
	let decrypted = decipher.update(encryptedKey, "base64", "utf-8");
	decrypted += decipher.final("utf-8");
	return decrypted;
}

function createMessage(token: string) {
	return `This is a secret message with token: ${token}`;
}

async function runHolder() {
	try {
		const nonceResponse = await fetch("http://localhost:3000/nonce");
		const { token } = (await nonceResponse.json()) as TokenResponse;

		if (!token) {
			throw new Error("Token not found in the response");
		}

		const message = createMessage(token);
		console.log("Message to sign:", message);

		const { publicKey, privateKey } = generateKeyPair();

		const key = decryptKey("your-passphrase", privateKey);

		const signer = createSign("RSA-SHA256");
		signer.update(message);
		const signature = signer.sign(key, "base64");
	} catch (error) {
		console.error("An error occurred in runHolder:", error);
	}
}
// start the program
runHolder();
