import { useState, useEffect, useCallback } from "react";
import { Date, Month, SpendingItem } from "../../../utils/types";
import store from "../../../utils/store";

type Params = {
  month: Month;
};

type Hook = {
  initialized: boolean;
  daySpendings: Record<Date, SpendingItem[]>;
  updateDaySpendingByDate: (date: Date, items: SpendingItem[]) => void;
};

export const useDaySpendings = ({ month }: Params): Hook => {
  const [initialized, setInitialized] = useState(false);
  const [daySpendings, setDaySpendings] = useState<
    Record<Date, SpendingItem[]>
  >({});

  const replaceDaySpendings = useCallback((d: Record<Date, SpendingItem[]>) => {
    setDaySpendings(d);
  }, []);

  const updateDaySpendingByDate = useCallback(
    (date: Date, items: SpendingItem[]) => {
      setDaySpendings((state) => ({ ...state, [date]: items }));
    },
    []
  );

  // initialize daySpendings data (from store)
  useEffect(() => {
    try {
      setInitialized(false);
      const d = store?.load<{
        data: Record<Date, SpendingItem[]>;
        memo: string;
      }>("monthData:" + month);
      if (d == null) {
        replaceDaySpendings({});
      } else {
        replaceDaySpendings(d.data);
      }
      setInitialized(true);
    } catch (err) {
      window.alert("failed to load data. Error=" + (err as Error).toString());
    }
  }, [month, replaceDaySpendings]);

  return {
    initialized,
    daySpendings,
    updateDaySpendingByDate,
  };
};
