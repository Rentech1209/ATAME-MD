# ATAME MD

WhatsApp bot with Telegram pairing. The web UI is disabled for now. The official channel is:
https://whatsapp.com/channel/0029VbCygs9DJ6Gt9MFD1Z0t

## Run

```bash
cp .env.example .env
npm install
npm start
```

Set `TELEGRAM_BOT_TOKEN` privately in `.env` or in the hosting provider secrets. Never commit it.

## Telegram commands

- `/start` or `/menu`: sends `assets/menu/menu.jpg` with the ATAME MD menu.
- `/pair 224623752938`: generates a WhatsApp pairing code directly in Telegram.
- `/connect 224623752938`: alias for `/pair`.
- `/ping`: checks that ATAME MD is online.
