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
    `Dear H.,`,
    ``,
    `I hope this message finds you well.`,
    ``,
    `Your personal access to the dossier has been`,
    `thoughtfully prepared and is ready for you.`,
    ``,
    `*Your Access Code: ${code}*`,
    ``,
    `You may use this code at the access gate`,
    `at any time that is convenient for you.`,
    ``,
    `This has been shared with you alone,`,
    `and I would kindly request that you keep it private.`,
    ``,
    `With sincere warmth and the deepest respect.`,
  ].join("\n");

  return callmebot(phone, apiKey, message);
}
