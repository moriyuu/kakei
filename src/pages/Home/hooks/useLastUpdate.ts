import { useMemo } from "react";
import dayjs from "dayjs";

import { SavedSpendingItem } from "../../../utils/types";

type Params = {
  spendingItems: SavedSpendingItem[];
};

export const useLastUpdate = ({ spendingItems }: Params) => {
  const lastUpdate = useMemo(
    () =>
      spendingItems.length > 0
        ? Math.max(
            ...spendingItems.map((spendingItem) =>
              dayjs(spendingItem.updatedAt).valueOf()
            )
          )
        : null,
    [spendingItems]
  );

  return useMemo(() => {
    if (!lastUpdate) {
      return null;
    }

    const d = dayjs(lastUpdate);

    const today = d.isToday();
    if (today) {
      return `${d.format("H:mm")} today`;
    }

    const thisYear = d.year() === dayjs().year();
    if (thisYear) {
      return `${d.format("MM/DD H:mm")}`;
    }

    return `${d.format("YYYY/MM/DD H:mm")}`;
  }, [lastUpdate]);
};
