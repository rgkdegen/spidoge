// SPIDOGE — leg thresholds and trading params
export const CONFIG = {
  entrySol: 0.8,            // size of a bite
  exitMultiple: 2.0,        // drain when the coin reaches this multiple
  maxHoldSec: 900,          // drain anyway after this long
  legs: {
    bundleMaxPct: 15,       // L4: max % of supply bundled in block 0
    top10MaxPct: 35,        // L5: max % held by the top 10 wallets
    minRealAccounts: 5,     // L6: min distinct real accounts mentioning the ticker
    washMaxPct: 40,         // L7: max % of volume flagged as wash
    devSoldMaxPct: 10,      // L8: max % of supply the dev has sold
    devMaxPriorRugs: 0,     // L8: rugs previously shipped by the dev wallet
  },
  dryRun: true,             // log decisions only, never send transactions
};
