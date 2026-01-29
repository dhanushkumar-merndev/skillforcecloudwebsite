
const TELEGRAM_BOT_TOKEN = import.meta.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = import.meta.env.TELEGRAM_CHAT_ID;

export async function sendToTelegram(message: string, file?: { blob: Blob, name: string }) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.error('Telegram credentials missing');
    return false;
  }

  try {
    if (file) {
      // Send file with message as caption
      const formData = new FormData();
      formData.append('chat_id', TELEGRAM_CHAT_ID);
      formData.append('document', file.blob, file.name);
      formData.append('caption', message);
      formData.append('parse_mode', 'HTML');

      const fileRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
        method: 'POST',
        body: formData,
      });

      if (!fileRes.ok) {
        console.error('Failed to send file to Telegram:', await fileRes.text());
        return false;
      }
    } else {
      // Send text message only
      const messageRes = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      });

      if (!messageRes.ok) {
        console.error('Failed to send text to Telegram:', await messageRes.text());
        return false;
      }
    }

    return true;
  }
 catch (err) {
    console.error('Telegram API error:', err);
    return false;
  }
}
