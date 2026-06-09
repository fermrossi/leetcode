/**
 * LeetCode 3743. Maximize Cyclic Partition Score  (Hard)
 * https://leetcode.com/problems/maximize-cyclic-partition-score/
 *
 * Cyclic array `nums`, integer `k`. Partition into AT MOST k contiguous arcs
 * (an arc may wrap from the end back to the start). The range of an arc is
 * max - min; the score is the sum of ranges. Return the maximum score.
 *
 * Approach ("sign DP"): every arc contributes +max and -min, so inside each arc
 * we mark exactly one element as its "+" (max) and one as its "-" (min). A
 * 1-element arc marks the same element as both, contributing 0. We sweep the
 * array building arcs, tracking how many arcs we have opened (j) and whether the
 * current open arc already placed its + (hp) and its - (hm). Because we maximize,
 * the DP ends up putting + on the real max and - on the real min, so the total
 * equals the sum of ranges. The cyclic "wrap" arc is handled by a 3-phase DP
 * (head -> middle -> tail) that glues the array's prefix and suffix into one arc.
 *
 * Time:  O(n * k)      Space: O(k)
 *
 * Note: LeetCode's stub may name the entry function `maxScore` or `maximizeScore`.
 * Both names are defined below, so either stub works as-is.
 */

const NEG = -Infinity;

function maxScore(nums: number[], k: number): number {
  const n = nums.length;
  if (n === 1) return 0;
  const K = Math.min(k, n);
  const lin = linearBest(nums, K);          // no wrap: a cut sits at the n-1 | 0 edge
  const wrp = wrapBest(nums, K);            // one arc wraps around that edge
  return Math.max(lin, wrp === NEG ? 0 : wrp);
}

// Alias so the solution matches whichever name the LeetCode stub uses.
function maximizeScore(nums: number[], k: number): number {
  return maxScore(nums, k);
}

/** Best sum of ranges for a LINEAR array, partitioned into <= K arcs.
 *  State dp[j][hp][hm] flattened as j*4 + hp*2 + hm. */
function linearBest(b: number[], K: number): number {
  const n = b.length;
  if (n === 0) return 0;
  const size = (K + 1) * 4;
  let dp = new Float64Array(size).fill(NEG);
  let nd = new Float64Array(size);
  dp[0] = 0;                                // j=0, hp=0, hm=0
  for (let idx = 0; idx < n; idx++) {
    const v = b[idx];
    nd.fill(NEG);
    for (let j = 0; j <= K; j++) {
      for (let hp = 0; hp < 2; hp++) {
        for (let hm = 0; hm < 2; hm++) {
          const g = dp[j * 4 + hp * 2 + hm];
          if (g === NEG) continue;
          if (j >= 1) {                      // keep v inside the current open arc
            const base = j * 4;
            if (g > nd[base + hp * 2 + hm]) nd[base + hp * 2 + hm] = g;             // interior
            if (!hp && g + v > nd[base + 2 + hm]) nd[base + 2 + hm] = g + v;        // v is the +
            if (!hm && g - v > nd[base + hp * 2 + 1]) nd[base + hp * 2 + 1] = g - v; // v is the -
            if (!hp && !hm && g > nd[base + 3]) nd[base + 3] = g;                   // v is both (0)
          }
          // open a NEW arc with v (allowed only if the previous arc is complete)
          if ((j === 0 || (hp === 1 && hm === 1)) && j + 1 <= K) {
            const nb = (j + 1) * 4;
            if (g > nd[nb]) nd[nb] = g;                       // hp=0, hm=0
            if (g + v > nd[nb + 2]) nd[nb + 2] = g + v;       // hp=1, hm=0
            if (g - v > nd[nb + 1]) nd[nb + 1] = g - v;       // hp=0, hm=1
            if (g > nd[nb + 3]) nd[nb + 3] = g;               // hp=1, hm=1
          }
        }
      }
    }
    const tmp = dp; dp = nd; nd = tmp;
  }
  let ans = NEG;
  for (let j = 1; j <= K; j++) if (dp[j * 4 + 3] > ans) ans = dp[j * 4 + 3]; // last arc complete
  return ans === NEG ? 0 : ans;
}

/** Cyclic case: one arc W wraps around, holding b[0] (its "head") and b[n-1]
 *  (its "tail"), with >= 1 "middle" arc in between. Three phases H -> M -> T,
 *  carrying W's role-state (wp, wm) so head and tail glue into a single arc. */
function wrapBest(b: number[], K: number): number {
  const n = b.length;
  if (n < 3 || K < 2) return NEG;
  const Msz = (K + 1) * 16;   // M[j][wp][wm][hp][hm] -> j*16 + wp*8 + wm*4 + hp*2 + hm
  const Tsz = (K + 1) * 4;    // T[j][wp][wm]         -> j*4  + wp*2 + wm
  let H = new Float64Array(4).fill(NEG);   // H[wp][wm] -> wp*2 + wm
  let M = new Float64Array(Msz).fill(NEG);
  let T = new Float64Array(Tsz).fill(NEG);
  let nH = new Float64Array(4);
  let nM = new Float64Array(Msz);
  let nT = new Float64Array(Tsz);
  H[0] = 0;
  for (let i = 0; i < n; i++) {
    const v = b[i];
    nH.fill(NEG); nM.fill(NEG); nT.fill(NEG);
    // --- from H (extend W's head, or close head and open the first middle arc) ---
    for (let wp = 0; wp < 2; wp++) {
      for (let wm = 0; wm < 2; wm++) {
        const g = H[wp * 2 + wm];
        if (g === NEG) continue;
        if (g > nH[wp * 2 + wm]) nH[wp * 2 + wm] = g;
        if (!wp && g + v > nH[2 + wm]) nH[2 + wm] = g + v;
        if (!wm && g - v > nH[wp * 2 + 1]) nH[wp * 2 + 1] = g - v;
        if (!wp && !wm && g > nH[3]) nH[3] = g;
        if (i >= 1 && 2 <= K) {                       // head = [0..i-1] (must contain b[0])
          const base = 2 * 16 + wp * 8 + wm * 4;      // j = 2 (W + this new middle arc)
          if (g + v > nM[base + 2]) nM[base + 2] = g + v;
          if (g - v > nM[base + 1]) nM[base + 1] = g - v;
          if (g > nM[base + 3]) nM[base + 3] = g;
          if (g > nM[base]) nM[base] = g;
        }
      }
    }
    // --- from M (extend a middle arc, open another middle arc, or resume W as tail) ---
    for (let j = 2; j <= K; j++) {
      for (let wp = 0; wp < 2; wp++) {
        for (let wm = 0; wm < 2; wm++) {
          const wbase = wp * 8 + wm * 4;
          for (let hp = 0; hp < 2; hp++) {
            for (let hm = 0; hm < 2; hm++) {
              const g = M[j * 16 + wbase + hp * 2 + hm];
              if (g === NEG) continue;
              const jb = j * 16 + wbase;
              if (g > nM[jb + hp * 2 + hm]) nM[jb + hp * 2 + hm] = g;
              if (!hp && g + v > nM[jb + 2 + hm]) nM[jb + 2 + hm] = g + v;
              if (!hm && g - v > nM[jb + hp * 2 + 1]) nM[jb + hp * 2 + 1] = g - v;
              if (!hp && !hm && g > nM[jb + 3]) nM[jb + 3] = g;
              if (hp === 1 && hm === 1) {              // current middle arc is complete
                if (j + 1 <= K) {                      // open another middle arc with v
                  const nb = (j + 1) * 16 + wbase;
                  if (g + v > nM[nb + 2]) nM[nb + 2] = g + v;
                  if (g - v > nM[nb + 1]) nM[nb + 1] = g - v;
                  if (g > nM[nb + 3]) nM[nb + 3] = g;
                  if (g > nM[nb]) nM[nb] = g;
                }
                const tb = j * 4;                      // resume W as the tail, place v in it
                if (g > nT[tb + wp * 2 + wm]) nT[tb + wp * 2 + wm] = g;
                if (!wp && g + v > nT[tb + 2 + wm]) nT[tb + 2 + wm] = g + v;
                if (!wm && g - v > nT[tb + wp * 2 + 1]) nT[tb + wp * 2 + 1] = g - v;
                if (!wp && !wm && g > nT[tb + 3]) nT[tb + 3] = g;
              }
            }
          }
        }
      }
    }
    // --- from T (extend W's tail) ---
    for (let j = 2; j <= K; j++) {
      for (let wp = 0; wp < 2; wp++) {
        for (let wm = 0; wm < 2; wm++) {
          const g = T[j * 4 + wp * 2 + wm];
          if (g === NEG) continue;
          const tb = j * 4;
          if (g > nT[tb + wp * 2 + wm]) nT[tb + wp * 2 + wm] = g;
          if (!wp && g + v > nT[tb + 2 + wm]) nT[tb + 2 + wm] = g + v;
          if (!wm && g - v > nT[tb + wp * 2 + 1]) nT[tb + wp * 2 + 1] = g - v;
          if (!wp && !wm && g > nT[tb + 3]) nT[tb + 3] = g;
        }
      }
    }
    let a = H; H = nH; nH = a;
    let b2 = M; M = nM; nM = b2;
    let c = T; T = nT; nT = c;
  }
  let ans = NEG;
  for (let j = 2; j <= K; j++) if (T[j * 4 + 3] > ans) ans = T[j * 4 + 3]; // W complete
  return ans;
}
