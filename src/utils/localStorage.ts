export const save = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const load = <T>(key: string): T | null => {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};
