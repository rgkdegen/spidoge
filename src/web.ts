import { CONFIG } from "./config";
import { LEGS, Mint, MintFacts } from "./legs";

export type Verdict =
  | { kind: "WRAP"; mint: Mint; leg: string; reason: string }
  | { kind: "BITE"; mint: Mint; entrySol: number };

export interface WebDeps {
  /** Async stream of freshly deployed pump.fun mints. */
  mints: () => AsyncIterable<Mint>;
  /** Fetch the facts the 8 legs need. */
  facts: (m: Mint) => Promise<MintFacts>;
  /** Called on BITE when dryRun is false. */
  buy?: (m: Mint, sol: number) => Promise<void>;
}

/** Scan one mint leg by leg. The first failing leg wraps it. */
export function scan(mint: Mint, facts: MintFacts): Verdict {
  for (const leg of LEGS) {
    const r = leg.check(facts);
    if (!r.pass) return { kind: "WRAP", mint, leg: `${leg.id} ${leg.name}`, reason: r.note };
  }
  return { kind: "BITE", mint, entrySol: CONFIG.entrySol };
}

/** The web: every mint that lands gets crawled to and scanned. */
export async function spin(deps: WebDeps, onVerdict: (v: Verdict) => void) {
  for await (const mint of deps.mints()) {
    const facts = await deps.facts(mint);
    const v = scan(mint, facts);
    onVerdict(v);
    if (v.kind === "BITE" && !CONFIG.dryRun && deps.buy) await deps.buy(mint, v.entrySol);
  }
}
