// Shared Claude helper for the MazingiraKenya scanners.
// Unlike the old per-function code, failures are NOT swallowed: every call returns
// { data, err } and the scanners report how many calls failed plus a sample error,
// so a dead key / exhausted credit / retired model shows up in the GitHub run.
//
// Secrets: ANTHROPIC_API_KEY (required), SCANNER_MODEL (optional override)

const KEY = Deno.env.get("ANTHROPIC_API_KEY") ?? "";
const MODEL = Deno.env.get("SCANNER_MODEL") ?? "claude-haiku-4-5";

export type LlmResult = { data: any | null; err: string | null; fatal: boolean };

export class LlmStats {
  ok = 0; errors = 0; sample_error = "";
  constructor(public model: string = MODEL) {}
  record(r: LlmResult) {
    if (r.err) { this.errors++; if (!this.sample_error) this.sample_error = r.err; } else this.ok++;
  }
  toJSON() {
    return { ok: this.ok, errors: this.errors, sample_error: this.sample_error, all_failed: this.ok === 0 && this.errors > 0, model: this.model };
  }
}

export async function askJson(system: string, user: string, maxTokens = 300, timeoutMs = 25000, model: string = MODEL): Promise<LlmResult> {
  if (!KEY) return { data: null, err: "ANTHROPIC_API_KEY is not set on this function", fatal: true };
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": KEY, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model, max_tokens: maxTokens, system, messages: [{ role: "user", content: user }] }),
      signal: AbortSignal.timeout(timeoutMs),
    });
    const j = await r.json().catch(() => null);
    if (!r.ok) {
      const msg = `HTTP ${r.status} ${j?.error?.type ?? ""}: ${j?.error?.message ?? ""}`.trim().slice(0, 220);
      // auth, permission, billing or unknown-model errors will fail every call, so stop early
      const fatal = [401, 403, 404].includes(r.status) || /credit|billing|model/i.test(msg);
      return { data: null, err: msg, fatal };
    }
    const txt = (j?.content ?? []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
    const m = txt.match(/\{[\s\S]*\}/);           // tolerate prose or ``` fences around the JSON
    if (!m) return { data: null, err: "no JSON in reply: " + txt.slice(0, 80), fatal: false };
    try { return { data: JSON.parse(m[0]), err: null, fatal: false }; }
    catch { return { data: null, err: "unparseable JSON: " + m[0].slice(0, 80), fatal: false }; }
  } catch (e) {
    return { data: null, err: "request failed: " + String(e).slice(0, 120), fatal: false };
  }
}

// Structured output via tool use: the API returns the tool input as an already-parsed object,
// so long multilingual text with quotes, apostrophes or line breaks can never break the JSON.
// Use for big outputs (e.g. the COP31 digest). stop_reason "max_tokens" is reported clearly.
export async function askTool(system: string, user: string, toolName: string, inputSchema: Record<string, unknown>,
  maxTokens = 4000, timeoutMs = 120000, model: string = MODEL): Promise<LlmResult> {
  if (!KEY) return { data: null, err: "ANTHROPIC_API_KEY is not set on this function", fatal: true };
  // Some models reject a forced tool_choice; fall back to "any" (only one tool, so same effect),
  // then to "auto" with the instruction to call the tool.
  const choices: any[] = [{ type: "tool", name: toolName }, { type: "any" }, { type: "auto" }];
  const deadline = Date.now() + timeoutMs;
  let lastErr = "";
  for (const choice of choices) {
    const left = deadline - Date.now();
    if (left < 20000) break;
    try {
      const r = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "content-type": "application/json", "x-api-key": KEY, "anthropic-version": "2023-06-01" },
        body: JSON.stringify({
          model, max_tokens: maxTokens, system, messages: [{ role: "user", content: user }],
          tools: [{ name: toolName, description: "Submit the finished result. Always call this exactly once.", input_schema: inputSchema }],
          tool_choice: choice,
        }),
        signal: AbortSignal.timeout(left),
      });
      const j = await r.json().catch(() => null);
      if (!r.ok) {
        // single quotes only, so the GitHub step can show the whole message
        const msg = `HTTP ${r.status} ${j?.error?.type ?? ""}: ${j?.error?.message ?? ""}`.replace(/"/g, "'").trim().slice(0, 300);
        lastErr = msg;
        if (r.status === 400 && /tool_choice|tool/i.test(msg)) continue;   // try the next tool_choice
        const fatal = [401, 403, 404].includes(r.status) || /credit|billing|model/i.test(msg);
        return { data: null, err: msg, fatal };
      }
      if (j?.stop_reason === "max_tokens") return { data: null, err: `reply cut off at max_tokens (${maxTokens})`, fatal: false };
      const block = (j?.content ?? []).find((b: any) => b.type === "tool_use" && b.name === toolName);
      if (block && typeof block.input === "object") return { data: block.input, err: null, fatal: false };
      // no tool call (auto mode): try to read JSON from the text as a last resort
      const txt = (j?.content ?? []).filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
      const m = txt.match(/\{[\s\S]*\}/);
      if (m) { try { return { data: JSON.parse(m[0]), err: null, fatal: false }; } catch { /* fall through */ } }
      return { data: null, err: "no structured result (stop_reason " + (j?.stop_reason ?? "?") + ")", fatal: false };
    } catch (e) {
      return { data: null, err: "request failed: " + String(e).replace(/"/g, "'").slice(0, 120), fatal: false };
    }
  }
  return { data: null, err: lastErr || "tool call not possible", fatal: false };
}
