/**
 * LeetCode 4. Median of Two Sorted Arrays  (Hard)
 * https://leetcode.com/problems/median-of-two-sorted-arrays/
 *
 * Idea: instead of merging the arrays (O(m + n)), we binary-search for a way to
 * "cut" both arrays into a LEFT half and a RIGHT half such that:
 *   - the left half holds exactly the first half of all elements, and
 *   - every value on the left is <= every value on the right.
 * Once that cut is correct, the median sits right on the border.
 *
 * We only search inside the SHORTER array, which gives O(log(min(m, n))) time.
 * Since log(min(m, n)) <= log(m + n), this respects the required O(log(m + n)).
 *
 * Time:  O(log(min(m, n)))
 * Space: O(1)
 *
 * Precondition: m + n >= 1 (guaranteed by the problem constraints).
 */
function findMedianSortedArrays(nums1: number[], nums2: number[]): number {
  // Make sure A is the shorter array so we binary-search the smaller range.
  let A = nums1;
  let B = nums2;
  if (A.length > B.length) {
    [A, B] = [B, A];
  }

  const m = A.length;
  const n = B.length;
  const total = m + n;

  // Number of elements that must end up on the LEFT side of the cut.
  // The "+ 1" sends the extra element to the left when total is odd,
  // which makes the odd-case median simply the largest left value.
  const half = Math.floor((total + 1) / 2);

  let lo = 0;
  let hi = m; // we may take anywhere from 0 to m elements of A on the left

  while (lo <= hi) {
    const i = Math.floor((lo + hi) / 2); // elements of A on the left
    const j = half - i;                  // the rest of the left comes from B

    // Values right next to the cut. We use -Infinity / +Infinity as sentinels
    // so the comparisons stay valid even when a side of the cut is empty.
    const aLeft = i > 0 ? A[i - 1] : -Infinity;
    const aRight = i < m ? A[i] : Infinity;
    const bLeft = j > 0 ? B[j - 1] : -Infinity;
    const bRight = j < n ? B[j] : Infinity;

    if (aLeft <= bRight && bLeft <= aRight) {
      // Correct cut: every left value <= every right value.
      if (total % 2 === 1) {
        // Odd total: the median is the biggest element on the left side.
        return Math.max(aLeft, bLeft);
      }
      // Even total: average the biggest-left and the smallest-right.
      return (Math.max(aLeft, bLeft) + Math.min(aRight, bRight)) / 2;
    } else if (aLeft > bRight) {
      // We took too many from A; move the cut in A to the left.
      hi = i - 1;
    } else {
      // We took too few from A; move the cut in A to the right.
      lo = i + 1;
    }
  }

  // Unreachable when the inputs are sorted (guaranteed by the problem).
  return 0;
}
