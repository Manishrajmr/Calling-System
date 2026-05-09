# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A calling system with a React client and Express backend. The system integrates with Vobiz API for telephony (making calls, checking balance/transactions) and OpenAI for AI responses.

## Directory Structure

```
├── client/          # React + TypeScript + Vite frontend
│   ├── src/
│   │   ├── components/   # UI components (CallForm, VobizOverview)
│   │   ├── services/     # API client (api.ts)
│   │   └── App.tsx        # Main app with React Router
│   └── vite.config.ts     # Vite config with ngrok host allowance
├── server/          # Express + TypeScript backend
│   └── src/
│       ├── controllers/   # Route handlers
│       ├── routes/        # Express route definitions
│       ├── services/      # Business logic (vobiz, openai)
│       └── utils/         # Utilities (XML builder, response helpers)
```

## Commands

### Client (runs on port 5173)
```bash
cd client
npm run dev          # Start dev server with HMR
npm run build        # Build for production
npm run lint         # Run ESLint
```

### Server (runs on port 5000)
```bash
cd server
npm run dev          # Start with ts-node (watch mode)
npm run build        # Compile TypeScript
npm run start         # Run compiled JS from dist/
```

## Architecture

**API Routes:**
- `POST /call/create` - Create a call via Vobiz
- `POST /voice/...` - Voice webhook endpoint
- `GET /api/vobiz/balance` - Get account balance
- `GET /api/vobiz/transactions` - Get transaction history
- `POST /api/openai/chat/completions` - Get AI response

**Vobiz Integration:** The `vobiz.service.ts` makes HTTP calls to Vobiz API. `vobizBalanceService.ts` handles balance checking and transaction history with metrics calculation (burn rate, time left).

**OpenAI Integration:** Uses OpenAI Responses API (`client.responses.create`) with model `gpt-5.4`. Response utilities in `openaiResponse.ts` extract text and usage data.

**Client-Server Communication:** API calls in `client/src/services/api.ts` hardcode the server URL: `https://consummatory-sherilyn-unlugubriously.ngrok-free.dev`

## Environment Variables

Server uses `.env` with: `VOBIZ_AUTH_ID`, `VOBIZ_AUTH_TOKEN`, `VOBIZ_CALLER_ID`, `VOBIZ_BASE_URL`, `VOBIZ_CALL_URL`, `OPENAI_API_KEY`, `PORT`
