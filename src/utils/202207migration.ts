import { Date, toDate, Yen, SpendingItem } from "./types";
import store from "./store";

const migrate = (before: Record<Date, Yen[]>): Record<Date, SpendingItem[]> => {
  const after: Record<Date, SpendingItem[]> = {};
  Object.keys(before).forEach((_date) => {
    const date = toDate(Number(_date));
    const items: SpendingItem[] = before[date].map((yen) => ({
      yen,
      comment: null,
    }));
    after[date] = items;
  });
  return after;
};

export const exec = () => {
  if (!window.confirm("ok?")) {
    return;
  }

  const d = store?.load<{
    data: Record<Date, Yen[]>;
    memo: string;
  }>("2022-07");
  if (d == null) {
    window.alert("err!");
    return;
  }

  const after = migrate(d.data);
  store?.save("monthData:2022-07", { data: after, memo: d.memo });
  window.alert("ok!");
};
