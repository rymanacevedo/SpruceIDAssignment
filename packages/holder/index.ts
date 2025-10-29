import { createDecipheriv, generateKeyPair } from "crypto";
import type { Token } from "typescript";

type TokenResponse = {
	token: string;
};

function getKeyValuePair() {
	generateKeyPair(
		"rsa",
		{
			modulusLength: 4096,
			publicKeyEncoding: {
				type: "spki",
				format: "pem",
			},
			privateKeyEncoding: {
				type: "pkcs8",
				format: "pem",
				cipher: "aes-256-cbc",
				passphrase: "super top secret",
			},
		},
		(err, publicKey, privateKey) => {
			// Handle errors and use the generated key pair.
		},
	);
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
	} catch (error) {
		console.error("An error occurred in runHolder:", error);
	}
}
// start the program
runHolder();
