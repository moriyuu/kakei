export const correctItemFormat = (itemString: string) =>
  !!itemString.match(/^\d+(\s*\(.*\))?$/);
