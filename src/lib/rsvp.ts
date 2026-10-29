export type Status = "yes" | "no";

// Apps Script web app URL, set in .env as VITE_RSVP_URL.
const URL_ = import.meta.env.VITE_RSVP_URL as string | undefined;

export const NAME_KEY = "ayoya:name";
const ID_KEY = "ayoya:id";
const STATUS_KEY = "ayoya:status";

// Stable per-device id: the same device always updates one row, whatever name is typed.
export function getDeviceId(): string {
  let id = localStorage.getItem(ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(ID_KEY, id);
  }
  return id;
}

// This device's last saved answer; the device id is the row key, so it is authoritative.
export function getSavedStatus(): Status | null {
  const s = localStorage.getItem(STATUS_KEY);
  return s === "yes" || s === "no" ? s : null;
}

export async function saveStatus(
  name: string,
  status: Status,
): Promise<boolean> {
  if (!URL_) return false;
  try {
    // text/plain avoids a CORS preflight, which Apps Script doesn't support.
    const res = await fetch(URL_, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({ id: getDeviceId(), name, status }),
    });
    const ok = (await res.json()).ok === true;
    if (ok) localStorage.setItem(STATUS_KEY, status);
    return ok;
  } catch {
    return false;
  }
}
