import { base_server } from "./config";
export function dateExtractor(x: string): string {
    if (!x) return "N/A"; // handle empty/null input
    const date = new Date(x);
    if (isNaN(date.getTime())) return "N/A"; // invalid date
    return date.toISOString().split("T")[0];
}

export function timeExtractor(x: string): string {
    if (!x) return "N/A"; // handle empty/null input
    const date = new Date(x);
    if (isNaN(date.getTime())) return "N/A"; // invalid date

    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // handle midnight (0 => 12)

    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
}

export function imgCreator(x:string):string{
    if (x.includes("http")) {
        return x
    }    
    return `${base_server}/${x}`
}
export function timeSumUp(time: string, duration: number): string {
  // time = ISO string (e.g. "2025-08-28T12:38:00.000Z")
  const base = new Date(time);

  if (isNaN(base.getTime())) {
    throw new Error("Invalid time input");
  }

  const result = new Date(base.getTime() + duration * 60 * 1000);

  // format hh:mm (24h) — you can tweak
  return result.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}


const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY??"venom"; // e.g., set in .env file

export function encrypt(text: string): string {
  if (!SECRET_KEY) throw new Error("Secret key is missing");
  const encoded = [];
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const keyCode = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
    encoded.push(charCode ^ keyCode);
  }
  return Buffer.from(new Uint8Array(encoded)).toString("base64");
}

export function decrypt(base64: string): string {
  if (!SECRET_KEY) throw new Error("Secret key is missing");
  const buffer = Buffer.from(base64, "base64");
  const decoded = [];
  for (let i = 0; i < buffer.length; i++) {
    const byte = buffer[i];
    const keyCode = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
    decoded.push(String.fromCharCode(byte ^ keyCode));
  }
  return decoded.join("");
}