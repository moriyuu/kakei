import { useMemo } from "react";
import dayjs from "dayjs";

import { Date, SavedSpendingItem, toDate } from "../../../utils/types";

type Params = {
  spendingItems: SavedSpendingItem[];
};

export const useDaySpendings = ({ spendingItems }: Params) => {
  return useMemo(
    () =>
      (spendingItems ?? [])
        .sort((a, b) => a.order - b.order)
        .reduce<Record<Date, SavedSpendingItem[]>>((memo, spendingItem) => {
          const date = toDate(dayjs(spendingItem.spentAt).get("date"));
          if (!memo[date]) {
            memo[date] = [spendingItem];
          } else {
            memo[date] = [...memo[date], spendingItem];
          }
          return memo;
        }, {}),
    [spendingItems]
  );
};
