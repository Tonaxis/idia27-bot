export function getNextKeys(
  data: Record<number, any>,
  key: number,
  count: number = 3
): number[] {
  const sortedKeys = Object.keys(data)
    .map(Number)
    .sort((a, b) => a - b);

  const currentIndex = sortedKeys.indexOf(key);
  if (currentIndex === -1) return [];

  return sortedKeys.slice(currentIndex + 1, currentIndex + 1 + count);
}
