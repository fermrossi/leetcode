# 3743. Maximize Cyclic Partition Score

**Difficulty:** Hard
**LeetCode:** https://leetcode.com/problems/maximize-cyclic-partition-score/
**Language:** TypeScript

---

## 🇺🇸 English

### Problem (summary)
You are given a **cyclic** array `nums` and an integer `k`. Partition `nums` into
**at most `k`** contiguous subarrays (arcs). Because the array is cyclic, an arc
may wrap from the end back to the beginning. The **range** of an arc is
`max - min`; the **score** of a partition is the sum of its arcs' ranges. Return
the maximum possible score.

**Constraints**
- `1 <= nums.length <= 1000`
- `1 <= nums[i] <= 10^9`
- `1 <= k <= nums.length`
- "At most `k`" means using fewer arcs is allowed.

### Approach / Reasoning
Merging everything (`O(n)` per arc) is fine, but the partition choice is the hard
part. The key observation is a **contribution model**: an arc's range `max - min`
means the arc contributes `+max` and `-min`. So inside every arc we mark **exactly
one element as its `+`** (its maximum) and **one as its `-`** (its minimum). A
single-element arc marks the same element as both, contributing `0`. Maximizing
the total `Σ(+) - Σ(-)` under "one `+` and one `-` per arc" automatically puts the
`+` on the true max and the `-` on the true min, so the optimum equals the sum of
ranges.

This becomes a **DP that sweeps the array building arcs**. The state tracks how
many arcs we've opened (`j`) and whether the current open arc already placed its
`+` (`hp`) and its `-` (`hm`). A new arc may start only when the previous arc is
**complete** (`hp && hm`).

Because the array is **cyclic**, exactly one arc may wrap around the `n-1 | 0`
edge. We solve two cases and take the max:
1. **No wrap** — a cut sits at the edge, so it's a plain linear DP.
2. **Wrap** — one arc `W` holds `nums[0]` (its *head*) and `nums[n-1]` (its
   *tail*) with `>= 1` arc in between. A **3-phase DP** (head → middle → tail)
   carries `W`'s role-state so head and tail glue into one arc.

### Complexity
- **Time:** `O(n * k)` — the required `O(log(m+n))` is for a different problem;
  here `n, k <= 1000`, so `O(n*k) <= 10^6` is comfortably fast.
- **Space:** `O(k)` — two rolling DP buffers; no per-arc structures.
- Scores stay `<= 1000 * 10^9 = 10^12 < 2^53`, so 64-bit floats (TS `number`)
  represent every intermediate value **exactly**.

### Examples
| `nums`        | `k` | Output | Why                                                        |
|---------------|-----|--------|------------------------------------------------------------|
| `[1,2,3,3]`   | `2` | `3`    | `[2,3]` and `[3,1]` (wrapped): ranges `1 + 2 = 3`          |
| `[1,2,3,3]`   | `1` | `2`    | whole array `[1,2,3,3]`: range `3 - 1 = 2`                 |
| `[1,2,3,3]`   | `4` | `3`    | same as `k=2` — using fewer than `k` arcs is allowed       |

### How to run / test
The file defines both `maxScore` and `maximizeScore` (an alias), so it matches
whichever name LeetCode's stub uses — just paste `solution.ts` into the editor.

```bash
# Deno (no dependency install needed)
deno eval "$(cat solution.ts); console.log(maxScore([1,2,3,3], 2))"   # -> 3

# ts-node (Node.js)
npm i -g ts-node typescript
ts-node -e "$(cat solution.ts); console.log(maxScore([1,2,3,3], 2))"  # -> 3
```

---

## 🇧🇷 Português (Brasil)

### Problema (resumo)
Você recebe um array **cíclico** `nums` e um inteiro `k`. Particione `nums` em
**no máximo `k`** subarranjos contíguos (arcos). Como o array é cíclico, um arco
pode **dar a volta** do fim para o começo. A **amplitude** de um arco é
`max - min`; o **score** de uma partição é a soma das amplitudes dos arcos.
Retorne o maior score possível.

**Restrições**
- `1 <= nums.length <= 1000`
- `1 <= nums[i] <= 10^9`
- `1 <= k <= nums.length`
- "No máximo `k`" significa que usar menos arcos é permitido.

### Abordagem / Raciocínio
A parte difícil é **escolher a partição**. A sacada é um **modelo de contribuição**:
a amplitude `max - min` de um arco significa que ele contribui com `+max` e `-min`.
Então, em cada arco, marcamos **exatamente um elemento como `+`** (o máximo) e
**um como `-`** (o mínimo). Um arco de um elemento marca o mesmo elemento como os
dois, contribuindo `0`. Ao maximizar `Σ(+) - Σ(-)` com a regra "um `+` e um `-`
por arco", o `+` naturalmente cai no verdadeiro máximo e o `-` no verdadeiro
mínimo — logo o ótimo é igual à soma das amplitudes.

Isso vira uma **DP que percorre o array montando arcos**. O estado guarda quantos
arcos já abrimos (`j`) e se o arco aberto atual já colocou seu `+` (`hp`) e seu
`-` (`hm`). Um novo arco só pode começar quando o anterior estiver **completo**
(`hp && hm`).

Como o array é **cíclico**, no máximo um arco pode dar a volta pela borda
`n-1 | 0`. Resolvemos dois casos e pegamos o máximo:
1. **Sem volta** — há um corte na borda, então é uma DP linear comum.
2. **Com volta** — um arco `W` contém `nums[0]` (sua *cabeça*) e `nums[n-1]` (sua
   *cauda*), com `>= 1` arco no meio. Uma **DP de 3 fases** (cabeça → meio →
   cauda) carrega o estado de `W` para "colar" cabeça e cauda em um único arco.

### Complexidade
- **Tempo:** `O(n * k)`. Como `n, k <= 1000`, isso é `<= 10^6` — bem rápido.
- **Espaço:** `O(k)` — dois buffers de DP rolantes; nada por arco.
- Os scores ficam `<= 1000 * 10^9 = 10^12 < 2^53`, então o `number` (float 64)
  representa **exatamente** todos os valores intermediários.

### Exemplos
| `nums`        | `k` | Saída | Por quê                                                    |
|---------------|-----|-------|------------------------------------------------------------|
| `[1,2,3,3]`   | `2` | `3`   | `[2,3]` e `[3,1]` (dando a volta): amplitudes `1 + 2 = 3`  |
| `[1,2,3,3]`   | `1` | `2`   | array inteiro `[1,2,3,3]`: amplitude `3 - 1 = 2`           |
| `[1,2,3,3]`   | `4` | `3`   | igual a `k=2` — usar menos que `k` arcos é permitido       |

### Como executar / testar
O arquivo define `maxScore` **e** `maximizeScore` (um alias), então casa com
qualquer nome que o stub do LeetCode use — basta colar `solution.ts` no editor.

```bash
# Deno (sem instalar dependências)
deno eval "$(cat solution.ts); console.log(maxScore([1,2,3,3], 2))"   # -> 3

# ts-node (Node.js)
npm i -g ts-node typescript
ts-node -e "$(cat solution.ts); console.log(maxScore([1,2,3,3], 2))"  # -> 3
```
