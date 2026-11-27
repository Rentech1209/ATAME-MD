# ATAME MD

WhatsApp bot with web pairing and an optional Telegram bridge.

## Run

```bash
cp .env.example .env
npm install
npm start
```

Set `TELEGRAM_BOT_TOKEN` to enable `/start`, `/menu`, `/pair`, and `/ping` on Telegram. The WhatsApp web pairing remains available at `WEB_URL`.
