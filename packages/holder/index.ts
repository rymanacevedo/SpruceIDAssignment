import { createSign, generateKeyPairSync } from "crypto";

type TokenResponse = {
	token: string;
};

type ValidResponse = {
	valid: boolean;
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
		},
	});

	return { publicKey, privateKey };
}

function createMessage(token: string) {
	return `This is a secret message with token: ${token}`;
}

async function runHolder() {
	try {
		// delay the execution to ensure the server is up
		console.log("Verifying signature process started...");
		await new Promise((resolve) => setTimeout(resolve, 2000));
		const nonceResponse = await fetch("http://localhost:3000/nonce");
		const { token } = (await nonceResponse.json()) as TokenResponse;

		if (!token) {
			throw new Error("Token not found in the response");
		}

		const message = createMessage(token);
		console.log("Message to sign:", message);

		const { publicKey, privateKey } = generateKeyPair();
		const signer = createSign("RSA-SHA256");
		signer.update(message);
		const signature = signer.sign(privateKey, "base64");

		const verifyResponse = await fetch("http://localhost:3000/verify", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				token,
				publicKey,
				message,
				signature,
			}),
		});

		const { valid } = (await verifyResponse.json()) as ValidResponse;
		console.log("Signature valid:", valid);
	} catch (error) {
		console.error("An error occurred in runHolder:", error);
	}
}
// start the program
runHolder();
