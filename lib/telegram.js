const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

/**
 * Optional Telegram bridge. It intentionally uses long polling so no webhook
 * or public callback is required. Set TELEGRAM_BOT_TOKEN to enable it.
 */
function startTelegramBot({ botName, ownerName, ownerNumber, telegramOwnerId, webUrl, pairApiUrl, menuImagePath }) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.log('ℹ️ Telegram bridge disabled: TELEGRAM_BOT_TOKEN is not set');
    return { stop: () => {} };
  }

  const api = axios.create({
    baseURL: `https://api.telegram.org/bot${token}`,
    timeout: 35000
  });
  let offset = 0;
  let stopped = false;

  const menu = () => [
    `╭───〔 ${botName} 〕───╮`,
    '│ /start — démarrer',
    '│ /menu — afficher le menu',
    '│ /pair — ouvrir le pairing web',
    '│ /ping — tester la disponibilité',
    `│ Owner: ${ownerName}`,
    '╰────────────────────╯'
  ].join('\n');

  async function send(chatId, text, extra = {}) {
    await api.post('/sendMessage', { chat_id: chatId, text, ...extra });
  }

  async function sendMenu(chatId, text) {
    if (menuImagePath && fs.existsSync(menuImagePath)) {
      const form = new FormData();
      form.append('chat_id', String(chatId));
      form.append('caption', text);
      form.append('photo', fs.createReadStream(menuImagePath));
      await api.post('/sendPhoto', form, { headers: form.getHeaders() });
    } else {
      await send(chatId, text);
    }
  }

  async function poll() {
    while (!stopped) {
      try {
        const { data } = await api.get('/getUpdates', { params: { timeout: 25, offset } });
        for (const update of data.result || []) {
          offset = update.update_id + 1;
          const message = update.message;
          if (!message?.chat?.id) continue;
          const text = (message.text || '').trim();
          const command = text.split(/\s+/)[0].toLowerCase().split('@')[0];
          if (command === '/start') {
            await sendMenu(message.chat.id, `Bienvenue sur ${botName}.\n\n${menu()}`);
          } else if (command === '/menu' || command === '/help') {
            await sendMenu(message.chat.id, menu());
          } else if (command === '/pair' || command === '/connect') {
            const number = text.split(/\s+/).slice(1).join('').replace(/\D/g, '');
            if (!number || number.length < 8 || number.length > 15) {
              await send(message.chat.id, `🔑 *${botName} WhatsApp pairing*\n\nUtilise : /pair <numéro avec indicatif>\nExemple : /pair 224623752938\n\nDeux commandes disponibles : /pair et /connect.`, { parse_mode: 'Markdown' });
              continue;
            }
            try {
              await send(message.chat.id, `⏳ Génération du code pour le numéro se terminant par ${number.slice(-4)}...`);
              const response = await axios.post(pairApiUrl, { number });
              const code = String(response.data?.pairingCode || '').trim();
              if (!code) throw new Error('Code de pairing absent');
              const masked = `${number.slice(0, 3)}•••${number.slice(-4)}`;
              await send(message.chat.id, `🔑 *${botName} WhatsApp pairing code* 🔑\n\n*Numéro:* ${masked}\n*Code:* \`${code.split('').join('-')}\`\n*Valide environ:* 3 minutes\n\n1. Ouvre WhatsApp → Appareils liés → Lier un appareil\n2. Choisis « Lier avec un numéro de téléphone »\n3. Entre ce code dans WhatsApp\n\n⚠️ Ne partage pas ce code.`, { parse_mode: 'Markdown' });
            } catch (error) {
              const reason = error.response?.data?.error || error.message;
              await send(message.chat.id, `❌ Impossible de générer le code de pairing : ${reason}`);
            }
          } else if (command === '/ping') {
            await send(message.chat.id, `🏓 Pong — ${botName} est actif.`);
          }
        }
      } catch (error) {
        if (!stopped) console.error('❌ Telegram polling error:', error.response?.data?.description || error.message);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }

  poll();
  console.log(`✅ Telegram bridge enabled for ${botName}`);
  return { stop: () => { stopped = true; } };
}

module.exports = { startTelegramBot };
