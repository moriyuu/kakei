export const save = (key: string, value: any) => {
  // console.log("store.save", JSON.stringify(value));
  localStorage.setItem(key, JSON.stringify(value));
};

export const load = <T>(key: string): T | null => {
  const value = localStorage.getItem(key);
  // console.log("store.load", value ? JSON.parse(value) : null);
  return value ? JSON.parse(value) : null;
};
