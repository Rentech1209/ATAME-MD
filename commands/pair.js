const axios = require("axios");

module.exports = {
    pattern: "pair",
    desc: "Connect your WhatsApp to ATAME MD for enhanced features",
    react: "💓",
    category: "utility",
    filename: __filename,

    execute: async (conn, mek, m, { from, args, q, reply }) => {
        // Helper function to send messages with contextInfo
        const sendMessageWithContext = async (text, quoted = mek) => {
            return await conn.sendMessage(from, {
                text: text,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: process.env.NEWSLETTER_JID || "120363378786516098@newsletter",
                        newsletterName: "❦ATAME MD❦",
                        serverMessageId: 200
                    }
                }
            }, { quoted: quoted });
        };

        try {
            // React with key emoji
            if (module.exports.react) {
                await conn.sendMessage(from, { react: { text: module.exports.react, key: mek.key } });
            }

            const pairingMessage = `🔑 *ATAME MD Pairing Instructions* 🔑\n\n` +
                                `🌐 *Pairing Link:* ${process.env.WEB_URL || "http://localhost:3000"}\n\n` +
                                `📋 *How to connect:*\n` +
                                `1. Enter your WhatsApp number with country code (no "+", no brackets, no spaces)\n` +
                                `2. Click "Request Pairing Code"\n` +
                                `3. Copy the 8-digit code\n` +
                                `4. Open WhatsApp → Settings → Linked Devices → Link a Device\n` +
                                `5. Paste the code when prompted\n\n` +
                                `💡 *Example:*\n` +
                                `Number: 1234567890 (for US number)\n` +
                                `Format: Country code + Number without spaces/symbols\n\n` +
                                `✅ *Benefits:*\n` +
                                `• Enhanced media downloading\n` +
                                `• Better quality audio/video\n` +
                                `• Opens view once \n\n` +
                                `> Powered By ❦𝗔𝗧𝗔𝗠𝗘 𝗠𝗗❦`;

            await sendMessageWithContext(pairingMessage);

        } catch (e) {
            console.error("❌ Pair Command Error:", e.message);
            await sendMessageWithContext(`⚠️ Error: ${e.message}`);
        }
    }
};