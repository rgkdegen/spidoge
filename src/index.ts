import { spin } from "./web";
import type { Mint, MintFacts } from "./legs";

// Replace these two with your real mint stream + data source.
async function* demoMints(): AsyncIterable<Mint> {
  const tickers = ["FROGE", "BONKLE", "WIFHAT", "GIGACAT", "PEPU", "SNAILZ"];
  for (const t of tickers) {
    await new Promise(r => setTimeout(r, 400));
    yield { address: `${t.toLowerCase()}...pump`, ticker: t, dev: "dev...", createdAt: Date.now() };
  }
}
async function demoFacts(m: Mint): Promise<MintFacts> {
  return {
    mintAuthority: m.ticker === "BONKLE" ? "live" : null,
    freezeAuthority: null,
    liquidityLocked: true,
    bundledPct: m.ticker === "GIGACAT" ? 31 : 2.1,
    top10Pct: 21,
    realAccounts: 412,
    washPct: 12,
    devSoldPct: m.ticker === "SNAILZ" ? 41 : 0,
    devPriorRugs: 0,
  };
}

spin({ mints: demoMints, facts: demoFacts }, v => {
  if (v.kind === "WRAP") console.log(`🕸  WRAP  $${v.mint.ticker.padEnd(8)} ${v.leg} · ${v.reason}`);
  else console.log(`🐕  BITE  $${v.mint.ticker.padEnd(8)} 8/8 legs clean · ${v.entrySol} SOL`);
});
