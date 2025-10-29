# SpruceID Assignment

A cryptographic signature verification system built with TypeScript and Bun, demonstrating secure nonce-based authentication and RSA signature verification.

## Project Structure

This is a monorepo with two main packages:

- **`packages/service/`** - HTTP API service for nonce generation and signature verification
- **`packages/holder/`** - Client application that generates key pairs, signs messages, and verifies signatures

## Prerequisites

### Installing Bun

This project requires [Bun](https://bun.sh/) v1.2.23 or later. Install Bun using one of the following methods:

**macOS/Linux:**
```bash
curl -fsSL https://bun.sh/install | bash
```

**Windows (PowerShell):**
```powershell
powershell -c "irm bun.sh/install.ps1 | iex"
```

**Alternative methods:**
- **Homebrew (macOS):** `brew install bun`
- **npm:** `npm install -g bun`
- **Docker:** `docker pull oven/bun`

After installation, verify Bun is working:
```bash
bun --version
```

You should see version 1.2.23 or later.

## Installation

Clone the repository and install dependencies for all packages:

```bash
git clone https://github.com/rymanacevedo/SpruceIDAssignment.git
cd SpruceIDAssignment
bun install
```

## Running the Project

### Option 1: Start Both Services (Recommended)

Run both the service and holder applications simultaneously:

```bash
bun run start
```

This command uses Turbo to orchestrate both packages and will:
1. Start the service API on `http://localhost:3000`
2. Run the holder client to demonstrate the signature verification flow

### Option 2: Start Services Individually

**Terminal 1 - Start the Service:**
```bash
cd packages/service
bun run dev
```

**Terminal 2 - Run the Holder:**
```bash
cd packages/holder
bun run dev
```

## How It Works

1. **Nonce Generation**: The service generates a cryptographically secure nonce (token) with a 5-minute expiration
2. **Key Pair Generation**: The holder generates an RSA key pair (2048-bit)
3. **Message Signing**: The holder creates a message containing the nonce and signs it with the private key
4. **Signature Verification**: The service verifies the signature using the provided public key

## API Endpoints

### GET `/nonce`
Generates a new nonce token.

**Response:**
```json
{
  "token": "32-character-hex-string"
}
```

### POST `/verify`
Verifies a signed message.

**Request Body:**
```json
{
  "token": "nonce-token",
  "publicKey": "PEM-formatted-public-key",
  "message": "message-to-verify",
  "signature": "base64-encoded-signature"
}
```

**Response:**
```json
{
  "valid": true
}
```

## Development

### Code Formatting
```bash
bun run format
```

### Project Structure
```
├── packages/
│   ├── service/           # HTTP API service
│   │   ├── src/
│   │   │   └── index.ts   # Main service implementation
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── holder/            # Client application
│       ├── index.ts       # Main holder implementation
│       ├── package.json
│       └── tsconfig.json
├── package.json           # Root package configuration
├── turbo.json            # Turbo build configuration
└── README.md
```

## Technologies Used

- **Runtime**: Bun v1.2.23
- **Framework**: Hono (for HTTP service)
- **Language**: TypeScript
- **Cryptography**: Node.js crypto module
- **Build Tool**: Turbo (monorepo orchestration)
- **Code Formatting**: Biome

## Security Features

- **Nonce Expiration**: Tokens automatically expire after 5 minutes
- **One-time Use**: Nonces are deleted after verification
- **RSA-SHA256**: Secure signature algorithm
- **2048-bit Keys**: Industry-standard key length

## Troubleshooting

### Common Issues

1. **"bun: command not found"**
   - Make sure Bun is installed and added to your PATH
   - Restart your terminal after installation

2. **Port 3000 already in use**
   - Stop any running processes on port 3000
   - Or modify the port in [`packages/service/src/index.ts`](packages/service/src/index.ts)

3. **Connection refused errors**
   - Ensure the service is running before starting the holder
   - The holder waits 2 seconds before making requests to allow service startup