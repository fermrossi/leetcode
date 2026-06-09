# 1768. Merge Strings Alternately — Easy

🔗 [LeetCode problem](https://leetcode.com/problems/merge-strings-alternately/)

---

## 🇺🇸 English

### Problem (summary)
You are given two strings `word1` and `word2`. Merge them by adding letters in
**alternating order, starting with `word1`**. If one string is longer than the
other, append the remaining letters to the end of the merged string. Return the
merged string.

### Approach / Reasoning
Walk a single index `i` from `0` up to the length of the **longer** string.
At each step:

1. If position `i` still exists in `word1`, append `word1[i]`.
2. If position `i` still exists in `word2`, append `word2[i]`.

Because we iterate up to `max(len1, len2)`, the leftover "tail" of the longer
string is naturally appended once the shorter one runs out.

We collect characters into an **array** and `join("")` once at the end. In
JavaScript/TypeScript strings are immutable, so building the result with `+=`
inside a loop can degrade to `O(n²)`. `array.push` is amortized `O(1)` and a
single `join` keeps the whole thing linear.

### Complexity
- **Time:** `O(n + m)` — `n = word1.length`, `m = word2.length`. We do constant
  work per character and touch each character exactly once.
- **Space:** `O(n + m)` — the output holds every character from both strings.
  (The constraints guarantee an output of at most 200 characters.)

### Examples
| `word1` | `word2` | Output    |
|---------|---------|-----------|
| `"abc"` | `"pqr"` | `"apbqcr"` |
| `"ab"`  | `"pqrs"`| `"apbqrs"` |
| `"abcd"`| `"pq"`  | `"apbqcd"` |

### How to run / test
```bash
# The solution is a standalone function (LeetCode TS signature).
# Uncomment the console.log lines at the bottom of solution.ts, then:
npx ts-node solution.ts
# or compile and run:
tsc solution.ts && node solution.js
```

---

## 🇧🇷 Português (Brasil)

### Problema (resumo)
Você recebe duas strings `word1` e `word2`. Junte-as **intercalando as letras,
começando por `word1`**. Se uma string for maior que a outra, anexe as letras
restantes ao final da string mesclada. Retorne a string resultante.

### Abordagem / Raciocínio
Percorra um único índice `i` de `0` até o comprimento da string **mais longa**.
A cada passo:

1. Se a posição `i` ainda existir em `word1`, adicione `word1[i]`.
2. Se a posição `i` ainda existir em `word2`, adicione `word2[i]`.

Como o laço vai até `max(len1, len2)`, o "rabinho" da string mais longa é
anexado naturalmente assim que a mais curta termina.

Acumulamos os caracteres em um **array** e fazemos `join("")` uma única vez no
final. Em JavaScript/TypeScript as strings são imutáveis, então montar o
resultado com `+=` dentro do laço pode cair para `O(n²)`. O `array.push` é
`O(1)` amortizado e um único `join` mantém o custo linear.

### Complexidade
- **Tempo:** `O(n + m)` — `n = word1.length`, `m = word2.length`. Trabalho
  constante por caractere, cada um visitado uma única vez.
- **Espaço:** `O(n + m)` — a saída guarda todos os caracteres das duas strings.
  (As restrições garantem saída de no máximo 200 caracteres.)

### Exemplos
| `word1` | `word2` | Saída     |
|---------|---------|-----------|
| `"abc"` | `"pqr"` | `"apbqcr"` |
| `"ab"`  | `"pqrs"`| `"apbqrs"` |
| `"abcd"`| `"pq"`  | `"apbqcd"` |

### Como executar / testar
```bash
# A solução é uma função independente (assinatura TS do LeetCode).
# Descomente as linhas console.log no fim de solution.ts e rode:
npx ts-node solution.ts
# ou compile e execute:
tsc solution.ts && node solution.js
```
