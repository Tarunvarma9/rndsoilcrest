import "server-only";

const CALLMEBOT_BASE = "https://api.callmebot.com/whatsapp.php";

export async function sendWhatsApp(message: string): Promise<boolean> {
  const phone  = process.env.ALERT_PHONE;      // e.g. +917277555999
  const apiKey = process.env.CALLMEBOT_API_KEY;

  if (!phone || !apiKey) return false;

  try {
    const url = `${CALLMEBOT_BASE}?phone=${encodeURIComponent(phone)}&text=${encodeURIComponent(message)}&apikey=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, { method: "GET", cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}
