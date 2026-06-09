// 3743. Maximize Cyclic Partition Score
// https://leetcode.com/problems/maximize-cyclic-partition-score/
// O(n*k) time, O(k) space.

const NEG = -Infinity;

function maximumScore(nums: number[], k: number): number {
  const n = nums.length;
  if (n === 1) return 0;
  const K = Math.min(k, n);
  const w = wrapBest(nums, K);
  return Math.max(linearBest(nums, K), w === NEG ? 0 : w);
}

// Linear array into <= K arcs. Each arc takes one "+" (its max) and one "-"
// (its min); a 1-element arc is both -> 0. State dp[j][hp][hm] = j*4 + hp*2 + hm.
function linearBest(b: number[], K: number): number {
  const n = b.length;
  if (n === 0) return 0;
  const size = (K + 1) * 4;
  let dp = new Float64Array(size).fill(NEG);
  let nd = new Float64Array(size);
  dp[0] = 0;
  for (let idx = 0; idx < n; idx++) {
    const v = b[idx];
    nd.fill(NEG);
    for (let j = 0; j <= K; j++) {
      for (let hp = 0; hp < 2; hp++) {
        for (let hm = 0; hm < 2; hm++) {
          const g = dp[j * 4 + hp * 2 + hm];
          if (g === NEG) continue;
          if (j >= 1) {
            const base = j * 4;
            if (g > nd[base + hp * 2 + hm]) nd[base + hp * 2 + hm] = g;
            if (!hp && g + v > nd[base + 2 + hm]) nd[base + 2 + hm] = g + v;
            if (!hm && g - v > nd[base + hp * 2 + 1]) nd[base + hp * 2 + 1] = g - v;
            if (!hp && !hm && g > nd[base + 3]) nd[base + 3] = g;
          }
          if ((j === 0 || (hp === 1 && hm === 1)) && j + 1 <= K) {
            const nb = (j + 1) * 4;
            if (g > nd[nb]) nd[nb] = g;
            if (g + v > nd[nb + 2]) nd[nb + 2] = g + v;
            if (g - v > nd[nb + 1]) nd[nb + 1] = g - v;
            if (g > nd[nb + 3]) nd[nb + 3] = g;
          }
        }
      }
    }
    const tmp = dp; dp = nd; nd = tmp;
  }
  let ans = NEG;
  for (let j = 1; j <= K; j++) if (dp[j * 4 + 3] > ans) ans = dp[j * 4 + 3];
  return ans === NEG ? 0 : ans;
}

// Cyclic case: one arc wraps the n-1|0 edge, holding b[0] (head) and b[n-1]
// (tail) with >= 1 arc between. Phases H -> M -> T carry the wrap arc's (wp, wm)
// so head and tail glue into a single arc.
function wrapBest(b: number[], K: number): number {
  const n = b.length;
  if (n < 3 || K < 2) return NEG;
  const Msz = (K + 1) * 16; // j*16 + wp*8 + wm*4 + hp*2 + hm
  const Tsz = (K + 1) * 4;  // j*4 + wp*2 + wm
  let H = new Float64Array(4).fill(NEG);
  let M = new Float64Array(Msz).fill(NEG);
  let T = new Float64Array(Tsz).fill(NEG);
  let nH = new Float64Array(4);
  let nM = new Float64Array(Msz);
  let nT = new Float64Array(Tsz);
  H[0] = 0;
  for (let i = 0; i < n; i++) {
    const v = b[i];
    nH.fill(NEG); nM.fill(NEG); nT.fill(NEG);
    for (let wp = 0; wp < 2; wp++) {
      for (let wm = 0; wm < 2; wm++) {
        const g = H[wp * 2 + wm];
        if (g === NEG) continue;
        if (g > nH[wp * 2 + wm]) nH[wp * 2 + wm] = g;
        if (!wp && g + v > nH[2 + wm]) nH[2 + wm] = g + v;
        if (!wm && g - v > nH[wp * 2 + 1]) nH[wp * 2 + 1] = g - v;
        if (!wp && !wm && g > nH[3]) nH[3] = g;
        if (i >= 1 && 2 <= K) {
          const base = 32 + wp * 8 + wm * 4;
          if (g + v > nM[base + 2]) nM[base + 2] = g + v;
          if (g - v > nM[base + 1]) nM[base + 1] = g - v;
          if (g > nM[base + 3]) nM[base + 3] = g;
          if (g > nM[base]) nM[base] = g;
        }
      }
    }
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
              if (hp === 1 && hm === 1) {
                if (j + 1 <= K) {
                  const nb = (j + 1) * 16 + wbase;
                  if (g + v > nM[nb + 2]) nM[nb + 2] = g + v;
                  if (g - v > nM[nb + 1]) nM[nb + 1] = g - v;
                  if (g > nM[nb + 3]) nM[nb + 3] = g;
                  if (g > nM[nb]) nM[nb] = g;
                }
                const tb = j * 4;
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
    let m = M; M = nM; nM = m;
    let t = T; T = nT; nT = t;
  }
  let ans = NEG;
  for (let j = 2; j <= K; j++) if (T[j * 4 + 3] > ans) ans = T[j * 4 + 3];
  return ans;
}
