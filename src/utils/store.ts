const save = (key: string, value: any) => {
  // console.log("store?.save", JSON.stringify(value));
  localStorage.setItem(key, JSON.stringify(value));
};

const load = <T>(key: string): T | null => {
  const value = localStorage.getItem(key);
  // console.log("store?.load", value ? JSON.parse(value) : null);
  return value ? JSON.parse(value) : null;
};

const remove = (key: string) => {
  localStorage.removeItem(key);
};

const store = typeof localStorage != null ? { save, load, remove } : null;

export default store;
