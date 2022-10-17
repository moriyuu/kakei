import { useMemo } from "react";
import useSWR from "swr";
import dayjs from "dayjs";

import client from "../../../lib/microcms";
import { Date, Month, SpendingItem, toDate } from "../../../utils/types";

type Params = {
  month: Month;
};

type Hook = {
  initialized: boolean;
  daySpendings: Record<Date, SpendingItem[]>;
  updateDaySpendingByDate: (date: Date, items: SpendingItem[]) => Promise<void>;
};

const fetcher = ({
  endpoint,
  greaterThan,
  lessThan,
}: {
  endpoint: string;
  greaterThan: string;
  lessThan: string;
}) =>
  client
    .get({
      endpoint,
      queries: {
        limit: 9999,
        filters: `spentAt[greater_than]${greaterThan}[and]spentAt[less_than]${lessThan}`,
      },
    })
    .then((res) => res.contents);

const useSpendingItems = ({ month }: Params) => {
  const greaterThan = dayjs(month).toISOString();
  const lessThan = dayjs(month).add(1, "month").toISOString();
  const { data, error } = useSWR<SpendingItem[]>(
    { endpoint: "spending-items", greaterThan, lessThan },
    fetcher
  );

  return {
    spendingItems: data,
    isLoading: !error && !data,
    error,
  };
};

export const useDaySpendings = ({ month }: Params): Hook => {
  const updateDaySpendingByDate = async (date: Date, items: SpendingItem[]) => {
    // TODO: delete and post to microCMS
  };

  const { spendingItems, isLoading } = useSpendingItems({ month });
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
    initialized: !isLoading,
    daySpendings,
    updateDaySpendingByDate,
  };
};
