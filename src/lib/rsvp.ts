export type Status = "yes" | "no";

// Apps Script web app URL, set in .env as VITE_RSVP_URL.
const URL_ = import.meta.env.VITE_RSVP_URL as string | undefined;

export const NAME_KEY = "ayoya:name";
const ID_KEY = "ayoya:id";
const STATUS_KEY = "ayoya:status";

// localStorage throws in private mode and some in-app browsers; fall back to memory.
const memory = new Map<string, string>();
function read(key: string): string | null {
  try {
    return localStorage.getItem(key) ?? memory.get(key) ?? null;
  } catch {
    return memory.get(key) ?? null;
  }
}
function write(key: string, value: string) {
  memory.set(key, value);
  try {
    localStorage.setItem(key, value);
  } catch {
    /* memory copy is enough for this session */
  }
}

export const getSavedName = () => read(NAME_KEY) ?? "";
export const setSavedName = (n: string) => write(NAME_KEY, n);

// randomUUID is missing on older browsers and non-HTTPS pages.
function newId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID)
    return crypto.randomUUID();
  const bytes = crypto.getRandomValues(new Uint8Array(16));
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

// Stable per-device id: the same device always updates one row, whatever name is typed.
export function getDeviceId(): string {
  let id = read(ID_KEY);
  if (!id) {
    id = newId();
    write(ID_KEY, id);
  }
  return id;
}

// This device's last saved answer; the device id is the row key, so it is authoritative.
export function getSavedStatus(): Status | null {
  const s = read(STATUS_KEY);
  return s === "yes" || s === "no" ? s : null;
}

async function post(name: string, status: Status): Promise<boolean> {
  // text/plain avoids a CORS preflight, which Apps Script doesn't support.
  const res = await fetch(URL_!, {
    method: "POST",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ id: getDeviceId(), name, status }),
  });
  return (await res.json()).ok === true;
}

export async function saveStatus(
  name: string,
  status: Status,
): Promise<boolean> {
  if (!URL_) {
    console.error("VITE_RSVP_URL is not set in this build");
    lastError = "no url";
    return false;
  }
  // Apps Script occasionally fails transiently (cold start, lock contention).
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (await post(name, status)) {
        write(STATUS_KEY, status);
        return true;
      }
      lastError = "server";
    } catch (err) {
      console.error("RSVP save failed", err);
      lastError = err instanceof Error ? err.message : "network";
    }
    await new Promise((r) => setTimeout(r, 800 * (attempt + 1)));
  }
  return false;
}
