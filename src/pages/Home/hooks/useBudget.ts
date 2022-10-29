import { useCallback, useEffect, useState } from "react";
import * as store from "../../../utils/localStorage";

type Hook = {
  businessDayBudget: number;
  holidayBudget: number;
  updateBudgetSetting: (
    businessDayBudget: number,
    holidayBudget: number
  ) => void;
};

export const useBudget = (): Hook => {
  const [businessDayBudget, setBusinessDayBudget] = useState<number>(2000);
  const [holidayBudget, setHolidayBudget] = useState<number>(3000);

  const updateBudgetSetting = useCallback(
    (businessDayBudget: number, holidayBudget: number) => {
      setBusinessDayBudget(businessDayBudget);
      setHolidayBudget(holidayBudget);
      store.save("budget", { businessDayBudget, holidayBudget });
    },
    []
  );

  useEffect(() => {
    try {
      const d = store.load<{
        businessDayBudget: number;
        holidayBudget: number;
      }>("budget");
      if (d != null) {
        setBusinessDayBudget(d.businessDayBudget);
        setHolidayBudget(d.holidayBudget);
      }
    } catch (err) {
      window.alert(
        "failed to load budget data. Error=" + (err as Error).toString()
      );
    }
  }, []);

  return {
    businessDayBudget,
    holidayBudget,
    updateBudgetSetting,
  };
};
