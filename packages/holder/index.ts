import { createDecipheriv, generateKeyPair } from "crypto";

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

function createMessage(nonce: string) {
	return `This is a secret message with nonce: ${nonce}`;
}
// start the program
