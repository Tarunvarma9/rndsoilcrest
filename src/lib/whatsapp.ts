import "server-only";

const CALLMEBOT_BASE = "https://api.callmebot.com/whatsapp.php";

async function callmebot(phone: string, apiKey: string, message: string): Promise<boolean> {
  try {
    const url = `${CALLMEBOT_BASE}?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}

// Owner alert channel (ALERT_PHONE / CALLMEBOT_API_KEY)
export async function sendWhatsApp(message: string): Promise<boolean> {
  const phone  = process.env.ALERT_PHONE;
  const apiKey = process.env.CALLMEBOT_API_KEY;
  if (!phone || !apiKey) return false;
  return callmebot(phone, apiKey, message);
}

// Love invite channel — separate recipient, separate API key
export async function sendLoveInvite(): Promise<boolean> {
  const phone  = process.env.LOVE_NOTIFY_PHONE;   // +917981419535
  const apiKey = process.env.LOVE_CALLMEBOT_KEY;  // API key for that number
  const code   = process.env.LOVE_CODE ?? "——";

  if (!phone || !apiKey) return false;

  const message = [
    `🌿`,
    ``,
    `Dear H.,`,
    ``,
    `Your personal access to the dossier has been`,
    `prepared with the greatest care and respect.`,
    ``,
    `🔑 *Your Access Code*`,
    `*${code}*`,
    ``,
    `Enter this at the access gate whenever you wish`,
    `to visit the space prepared exclusively for you.`,
    ``,
    `_Please keep this private — it is yours alone._`,
    ``,
    `With sincere warmth and gratitude 🤍`,
  ].join("\n");

  return callmebot(phone, apiKey, message);
}
