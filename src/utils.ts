
// TODO: If we don't create an empty object if there's no body, we won't need this function
//       (would be able to just check for undefined/null)
export function isEmpty(obj: Record<string, any> | undefined | null) {
  if (obj === undefined || obj === null) return true;

  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
}

// https://stackoverflow.com/a/48469793
export function count2DArray(arr: any[][]): number {
  return arr.reduce((currentCount, row) => currentCount + row.length, 0);
}

// https://stackoverflow.com/a/9229821
export function removeDuplicates<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}