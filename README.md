# ATAME MD

WhatsApp bot with Telegram pairing. The web UI is disabled for now.

## Run

```bash
cp .env.example .env
npm install
npm start
```

Set `TELEGRAM_BOT_TOKEN` to enable Telegram.

## Telegram commands

- `/start` or `/menu`: sends `assets/menu/menu.jpg` with the menu.
- `/pair 224623752938`: generates a WhatsApp pairing code directly in Telegram.
- `/connect 224623752938`: alias for `/pair`.
- `/ping`: checks that the bot is online.

Use the WhatsApp pairing code in WhatsApp → Appareils liés → Lier un appareil → Lier avec un numéro de téléphone.
