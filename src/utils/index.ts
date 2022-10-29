export const sum = (nums: number[]) => nums.reduce((memo, n) => memo + n, 0);

export const assertNever = (value: never) => {
  throw new Error("unexpected value: ", value);
};
