import { useMemo } from "react";
import useSWR from "swr";
import dayjs from "dayjs";

import { Date, Month, SpendingItem, toDate } from "../../../utils/types";

type Params = {
  month: Month;
};

type Hook = {
  isLoading: boolean;
  daySpendings: Record<Date, SpendingItem[]>;
};

export const useDaySpendings = ({ month }: Params): Hook => {
  const greaterThan = dayjs(month).toISOString();
  const lessThan = dayjs(month).add(1, "month").toISOString();
  const { data, error } = useSWR<{ spendingItems: SpendingItem[] }>({
    url: "/spending-items",
    params: { greaterThan, lessThan },
  });
  const spendingItems = data?.spendingItems;

  const daySpendings = useMemo(
    () =>
      (spendingItems ?? []).reduce<Record<Date, SpendingItem[]>>(
        (memo, spendingItem) => {
          const date = toDate(dayjs(spendingItem.spentAt).get("date"));
          if (!memo[date]) {
            memo[date] = [spendingItem];
          } else {
            memo[date] = [...memo[date], spendingItem];
          }
          return memo;
        },
        {}
      ),
    [spendingItems]
  );

  return {
    isLoading: !error && !data,
    daySpendings,
  };
};
