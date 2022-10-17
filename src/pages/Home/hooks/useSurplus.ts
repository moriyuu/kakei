import { useMemo } from "react";
import { sum } from "../../../utils";
import { Date, toDate, SpendingItem, Day } from "../../../utils/types";

type Params = {
  daySpendings: Record<Date, SpendingItem[]>;
  days: Day[];
  businessDayBudget: number;
  holidayBudget: number;
};

export const useSurplus = ({
  daySpendings,
  days,
  businessDayBudget,
  holidayBudget,
}: Params) => {
  return useMemo(
    () =>
      Object.keys(daySpendings)
        .map((date) => toDate(Number(date)))
        .filter((date) => daySpendings[date].length > 0)
        .reduce((memo, date) => {
          const isHoliday =
            days.find((day) => day.date === date)?.isHoliday || false;
          const dayTotal = sum(daySpendings[date].map((d) => d.amount));
          const budget = isHoliday ? holidayBudget : businessDayBudget;
          const diff = budget - dayTotal;
          return memo + diff;
        }, 0),
    [daySpendings, days, businessDayBudget, holidayBudget]
  );
};
