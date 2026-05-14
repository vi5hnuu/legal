export type DiffLine =
  | { type: "equal"; text: string }
  | { type: "remove"; text: string }
  | { type: "add"; text: string };

function buildLcs(a: string[], b: string[]): number[][] {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () =>
    new Array(n + 1).fill(0)
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1] + 1
          : Math.max(dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp;
}

function backtrack(
  dp: number[][],
  a: string[],
  b: string[],
  i: number,
  j: number,
  result: DiffLine[]
): void {
  if (i === 0 && j === 0) return;
  if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
    backtrack(dp, a, b, i - 1, j - 1, result);
    result.push({ type: "equal", text: a[i - 1] });
  } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
    backtrack(dp, a, b, i, j - 1, result);
    result.push({ type: "add", text: b[j - 1] });
  } else {
    backtrack(dp, a, b, i - 1, j, result);
    result.push({ type: "remove", text: a[i - 1] });
  }
}

export function diffLines(oldText: string, newText: string): DiffLine[] {
  const a = oldText.split("\n");
  const b = newText.split("\n");
  const dp = buildLcs(a, b);
  const result: DiffLine[] = [];
  backtrack(dp, a, b, a.length, b.length, result);
  return result;
}

export function hasDifferences(lines: DiffLine[]): boolean {
  return lines.some((l) => l.type !== "equal");
}
