# 4. Median of Two Sorted Arrays

**Difficulty:** Hard
**LeetCode:** https://leetcode.com/problems/median-of-two-sorted-arrays/
**Language:** TypeScript

---

## 🇺🇸 English

### Problem (summary)
Given two sorted arrays `nums1` and `nums2` of sizes `m` and `n`, return the
median of the combined sorted array. The required overall time complexity is
`O(log (m + n))`.

**Constraints**
- `nums1.length == m`, `nums2.length == n`
- `0 <= m <= 1000`, `0 <= n <= 1000`, `1 <= m + n <= 2000`
- `-10^6 <= nums1[i], nums2[i] <= 10^6`

### Approach / Reasoning
Merging both arrays would cost `O(m + n)`, which is not allowed. Instead, we
**binary-search for a partition**.

Imagine cutting both arrays into a **left half** and a **right half** so that
the left half contains exactly the first `⌈(m + n) / 2⌉` smallest elements. If
we pick `i` elements from `A` for the left half, then we must pick
`j = half - i` from `B`. The cut is **correct** when every value on the left is
`<=` every value on the right, which (because each array is already sorted)
reduces to just two checks at the border:

```
A[i-1] <= B[j]   and   B[j-1] <= A[i]
```

We binary-search `i` over the **shorter** array:
- If `A[i-1] > B[j]` → we took too many from `A` → search left (`hi = i - 1`).
- If `B[j-1] > A[i]` → we took too few from `A`  → search right (`lo = i + 1`).
- Otherwise the cut is correct.

`-Infinity` / `+Infinity` sentinels stand in when a side of a cut is empty
(e.g. `i = 0` or `i = m`), so the border comparisons never go out of bounds.

When the cut is correct:
- **Odd** total → median = `max(A[i-1], B[j-1])` (largest value on the left).
- **Even** total → median = `(max(A[i-1], B[j-1]) + min(A[i], B[j])) / 2`.

### Complexity
- **Time:** `O(log(min(m, n)))`. Since `log(min(m, n)) <= log(m + n)`, this
  satisfies the required `O(log(m + n))`.
- **Space:** `O(1)` — only a handful of scalar variables, no extra arrays.

### Examples
| `nums1`   | `nums2` | Output    | Why                                            |
|-----------|---------|-----------|------------------------------------------------|
| `[1,3]`   | `[2]`   | `2.00000` | merged `[1,2,3]`, middle element is `2`        |
| `[1,2]`   | `[3,4]` | `2.50000` | merged `[1,2,3,4]`, average of `2` and `3`     |
| `[]`      | `[1]`   | `1.00000` | only one element                               |

### How to run / test
The file exposes the exact signature LeetCode expects, so you can paste
`solution.ts` straight into the editor at the link above.

To run it locally you need a TypeScript runtime. Examples:

```bash
# Option A — ts-node (Node.js)
npm i -g ts-node typescript
ts-node -e "$(cat solution.ts); console.log(findMedianSortedArrays([1,3],[2]))"

# Option B — Deno (no install of deps needed)
deno eval "$(cat solution.ts); console.log(findMedianSortedArrays([1,3],[2]))"
```

Expected output: `2` (LeetCode shows it as `2.00000` — same value, just its fixed-width display formatting).

---

## 🇧🇷 Português (Brasil)

### Problema (resumo)
Dados dois arrays **ordenados** `nums1` e `nums2`, de tamanhos `m` e `n`,
retorne a **mediana** do array combinado (também ordenado). A complexidade de
tempo exigida é `O(log (m + n))`.

**Restrições**
- `nums1.length == m`, `nums2.length == n`
- `0 <= m <= 1000`, `0 <= n <= 1000`, `1 <= m + n <= 2000`
- `-10^6 <= nums1[i], nums2[i] <= 10^6`

### Abordagem / Raciocínio
Juntar (merge) os dois arrays custaria `O(m + n)`, o que não é permitido. Em vez
disso, fazemos uma **busca binária por uma partição**.

Imagine cortar os dois arrays em uma **metade esquerda** e uma **metade
direita**, de modo que a metade esquerda contenha exatamente os
`⌈(m + n) / 2⌉` menores elementos. Se pegarmos `i` elementos de `A` para a
esquerda, então precisamos pegar `j = half - i` de `B`. O corte está **correto**
quando todo valor da esquerda é `<=` a todo valor da direita — e, como cada
array já está ordenado, isso se resume a duas comparações na fronteira:

```
A[i-1] <= B[j]   e   B[j-1] <= A[i]
```

Fazemos a busca binária de `i` no array **menor**:
- Se `A[i-1] > B[j]` → pegamos demais de `A` → busca à esquerda (`hi = i - 1`).
- Se `B[j-1] > A[i]` → pegamos de menos de `A` → busca à direita (`lo = i + 1`).
- Caso contrário, o corte está correto.

Usamos sentinelas `-Infinity` / `+Infinity` quando um dos lados do corte está
vazio (ex.: `i = 0` ou `i = m`), assim as comparações de fronteira nunca saem
dos limites do array.

Quando o corte está correto:
- Total **ímpar** → mediana = `max(A[i-1], B[j-1])` (maior valor da esquerda).
- Total **par**   → mediana = `(max(A[i-1], B[j-1]) + min(A[i], B[j])) / 2`.

### Complexidade
- **Tempo:** `O(log(min(m, n)))`. Como `log(min(m, n)) <= log(m + n)`, isso
  satisfaz o `O(log(m + n))` exigido.
- **Espaço:** `O(1)` — apenas algumas variáveis escalares, sem arrays extras.

### Exemplos
| `nums1`   | `nums2` | Saída     | Por quê                                        |
|-----------|---------|-----------|------------------------------------------------|
| `[1,3]`   | `[2]`   | `2.00000` | combinado `[1,2,3]`, elemento do meio é `2`    |
| `[1,2]`   | `[3,4]` | `2.50000` | combinado `[1,2,3,4]`, média de `2` e `3`      |
| `[]`      | `[1]`   | `1.00000` | apenas um elemento                             |

### Como executar / testar
O arquivo expõe exatamente a assinatura que o LeetCode espera, então você pode
colar `solution.ts` direto no editor do link acima.

Para rodar localmente, é preciso um runtime de TypeScript. Exemplos:

```bash
# Opção A — ts-node (Node.js)
npm i -g ts-node typescript
ts-node -e "$(cat solution.ts); console.log(findMedianSortedArrays([1,3],[2]))"

# Opção B — Deno (sem instalar dependências)
deno eval "$(cat solution.ts); console.log(findMedianSortedArrays([1,3],[2]))"
```

Saída esperada: `2` (o LeetCode exibe como `2.00000` — é o mesmo valor, apenas a formatação de exibição dele).
