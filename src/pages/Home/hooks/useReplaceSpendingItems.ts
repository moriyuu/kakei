import dayjs from "dayjs";
import { useCallback } from "react";
import { trpc } from "../../../lib/trpc";
import { Day, UnsavedSpendingItem } from "../../../utils/types";

export const useReplaceSpendingItems = () => {
  const utils = trpc.useContext();
  const mutation = trpc.replaceSpendingItems.useMutation({
    onSettled: async () => {
      await utils.spendingItems.refetch();
    },
  });

  const replaceSpendingItemsOfDay = useCallback(
    (day: Day, spendingItems: UnsavedSpendingItem[]) => {
      const moreRecentThanEqual = dayjs(day.datetime).toISOString();
      const olderThan = dayjs(day.datetime).add(1, "day").toISOString();
      mutation.mutate({
        moreRecentThanEqual,
        olderThan,
        spendingItems,
      });
    },
    [mutation]
  );

  return {
    replaceSpendingItemsOfDay,
    status: mutation.status,
    error: mutation.error,
  };
};
