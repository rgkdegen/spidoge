import { CONFIG } from "./config";

export interface Mint {
  address: string;
  ticker: string;
  dev: string;
  createdAt: number;
}

/** Facts about a mint. Wire each field to your own RPC / indexer / pump.fun API. */
export interface MintFacts {
  mintAuthority: string | null;
  freezeAuthority: string | null;
  liquidityLocked: boolean;
  bundledPct: number;
  top10Pct: number;
  realAccounts: number;
  washPct: number;
  devSoldPct: number;
  devPriorRugs: number;
}

export type LegResult = { pass: true; note: string } | { pass: false; note: string };

export interface Leg {
  id: `L${1 | 2 | 3 | 4 | 5 | 6 | 7 | 8}`;
  name: string;
  check: (f: MintFacts) => LegResult;
}

const L = CONFIG.legs;
const ok = (note: string): LegResult => ({ pass: true, note });
const bad = (note: string): LegResult => ({ pass: false, note });

export const LEGS: Leg[] = [
  { id: "L1", name: "MINT",   check: f => f.mintAuthority === null ? ok("revoked") : bad("mint authority LIVE") },
  { id: "L2", name: "FREEZE", check: f => f.freezeAuthority === null ? ok("revoked") : bad("freeze authority ON") },
  { id: "L3", name: "LP",     check: f => f.liquidityLocked ? ok("curve-locked") : bad("LP pulled") },
  { id: "L4", name: "BUNDLE", check: f => f.bundledPct <= L.bundleMaxPct ? ok(`${f.bundledPct.toFixed(1)}% bundled`) : bad(`${f.bundledPct.toFixed(0)}% sniped in block 0`) },
  { id: "L5", name: "TOP10",  check: f => f.top10Pct <= L.top10MaxPct ? ok(`top10 ${f.top10Pct.toFixed(0)}%`) : bad(`top10 hold ${f.top10Pct.toFixed(0)}%`) },
  { id: "L6", name: "SOCIAL", check: f => f.realAccounts >= L.minRealAccounts ? ok(`${f.realAccounts} real accts`) : bad("0 real accounts talking") },
  { id: "L7", name: "WASH",   check: f => f.washPct <= L.washMaxPct ? ok(`${(100 - f.washPct).toFixed(0)}% organic`) : bad(`${f.washPct.toFixed(0)}% wash volume`) },
  { id: "L8", name: "DEV",    check: f =>
      f.devSoldPct > L.devSoldMaxPct ? bad(`DEV SOLD ${f.devSoldPct.toFixed(0)}%`)
    : f.devPriorRugs > L.devMaxPriorRugs ? bad(`dev shipped ${f.devPriorRugs} rugs`)
    : ok("dev holding") },
];
