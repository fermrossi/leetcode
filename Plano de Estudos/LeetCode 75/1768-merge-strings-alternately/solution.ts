/**
 * 1768. Merge Strings Alternately
 * https://leetcode.com/problems/merge-strings-alternately/
 *
 * Intercala as letras de word1 e word2, começando por word1.
 * Quando uma string acaba, o restante da outra é anexado no final.
 *
 * Estratégia: dois "ponteiros" implícitos com um único índice `i` que
 * percorre até o comprimento da string mais longa. A cada passo, se ainda
 * houver letra naquela posição, ela é adicionada ao resultado.
 *
 * Por que acumular em um array e usar join no final?
 * Em JavaScript/TypeScript a string é imutável: fazer `res += letra` dentro
 * de um laço pode criar uma nova string a cada passo (custo que tende a
 * O(n²) no pior caso). Empurrar em um array (push é O(1) amortizado) e
 * juntar uma única vez com join() mantém o custo linear O(n + m).
 */
function mergeAlternately(word1: string, word2: string): string {
  // Pedaços do resultado; juntamos tudo só no final.
  const merged: string[] = [];

  // Vamos até o comprimento da MAIOR string para não perder o "rabinho".
  const maxLen = Math.max(word1.length, word2.length);

  for (let i = 0; i < maxLen; i++) {
    // Só adiciona se essa posição ainda existir em word1.
    if (i < word1.length) {
      merged.push(word1[i]);
    }
    // Em seguida, a letra de word2 (se ainda existir nessa posição).
    if (i < word2.length) {
      merged.push(word2[i]);
    }
  }

  // Uma única concatenação eficiente.
  return merged.join("");
}

/* --------------------------------------------------------------------------
 * Testes rápidos (rode com: npx ts-node solution.ts).
 * No LeetCode, NÃO cole este bloco abaixo — apenas a função acima.
 * -------------------------------------------------------------------------- */
// console.log(mergeAlternately("abc", "pqr"));   // "apbqcr"
// console.log(mergeAlternately("ab", "pqrs"));   // "apbqrs"
// console.log(mergeAlternately("abcd", "pq"));   // "apbqcd"
