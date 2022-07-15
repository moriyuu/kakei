import { Date, toDate, Yen, Items } from "./types";
import * as store from "./store";

const migrate = (before: Record<Date, Yen[]>): Record<Date, Items> => {
  const after: Record<Date, Items> = {};
  Object.keys(before).forEach((_date) => {
    const date = toDate(Number(_date));
    const items: Items = before[date].map((yen) => ({
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

  const d = store.load<{
    data: Record<Date, Yen[]>;
    memo: string;
  }>("2022-07");
  if (d == null) {
    window.alert("err!");
    return;
  }

  const after = migrate(d.data);
  store.save("monthData:2022-07", { data: after, memo: d.memo });
  window.alert("ok!");
};
