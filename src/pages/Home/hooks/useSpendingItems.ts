import dayjs from "dayjs";

import { Month, SavedSpendingItem } from "../../../utils/types";
import { trpc } from "../../../lib/trpc";

type Params = {
  month: Month;
};

type Hook = {
  isLoading: boolean;
  spendingItems: SavedSpendingItem[] | null;
};

export const useSpendingItems = ({ month }: Params): Hook => {
  const moreRecentThanEqual = dayjs(month).toISOString();
  const olderThan = dayjs(month).add(1, "month").toISOString();
  const { data, isLoading } = trpc.spendingItems.useQuery({
    moreRecentThanEqual,
    olderThan,
  });
  const spendingItems = data?.spendingItems ?? null;

  return {
    isLoading,
    spendingItems,
  };
};
