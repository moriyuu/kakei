import type { NextPage } from "next";
import { useState, useEffect, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import copy from "copy-to-clipboard";

import styles from "./Home.module.css";
import { Footer } from "../../components/Footer";
import { sum } from "../../utils";
import * as store from "../../utils/store";
import { Month, toMonth } from "../../utils/types";
import { Head } from "./Head";
import { Header } from "./Header";
import { useSurplus } from "./hooks/useSurplus";
import { useBudget } from "./hooks/useBudget";
import { useDaySpendings } from "./hooks/useDaySpendings";
import { DaySpendingListItem } from "../../components/DaySpendingListItem";
import { getDaysOfMonth } from "../../utils/day";

const Home: NextPage = () => {
  //
  // states
  //
  const [isClient, setIsClient] = useState(false);
  const [month, setMonth] = useState<Month>(toMonth(dayjs().format("YYYY-MM")));

  //
  // memos
  //
  const days = useMemo(() => getDaysOfMonth(month), [month]);

  //
  // hooks
  //
  const { businessDayBudget, holidayBudget, updateBudgetSetting } = useBudget();
  const { initialized, daySpendings, updateDaySpendingByDate } =
    useDaySpendings({ month });
  const surplus = useSurplus({
    daySpendings,
    days,
    businessDayBudget,
    holidayBudget,
  });

  //
  // callbacks
  //
  const changeMonth = useCallback((month: Month) => {
    setMonth(month);
  }, []);

  const copyContentAsText = useCallback(() => {
    const content = days.reduce((memo, { date, isHoliday }) => {
      const items = daySpendings[date] || [];
      if (items.length > 0) {
        const yens = items.map((item) => item.yen);
        const dayTotal = sum(yens);
        const budget = isHoliday ? holidayBudget : businessDayBudget;
        const diff = budget - dayTotal;
        const diffStr = diff >= 0 ? `${diff}+` : `${-diff}-`;
        const rowStr = `${date}. ${items
          .map(
            (item) => `${item.yen}${item.comment ? `(${item.comment})` : ""}`
          )
          .join("+")} = ${dayTotal} (${diffStr})`;
        return memo + rowStr + "\n";
      } else {
        const rowStr = `${date}. `;
        return memo + rowStr + "\n";
      }
    }, "");
    const surplusText = `surplus = ${surplus}`;
    copy(content + surplusText);
  }, [days, daySpendings, businessDayBudget, holidayBudget, surplus]);

  //
  // effects
  //

  useEffect(() => {
    setIsClient(true);
  }, []);

  // save daySpendings data to store
  useEffect(() => {
    if (!initialized) {
      return;
    }
    store.save("monthData:" + month, { data: daySpendings });
  }, [initialized, month, daySpendings]);

  return (
    <>
      <Head />

      <div className={styles.container}>
        <Header
          month={month}
          changeMonth={changeMonth}
          businessDayBudget={businessDayBudget}
          holidayBudget={holidayBudget}
          updateBudgetSetting={updateBudgetSetting}
          copyContentAsText={copyContentAsText}
        />

        {initialized ? (
          <>
            <div>surplus: {surplus}</div>
            <ol className={styles.list}>
              {days.map((day) => {
                const items = daySpendings[day.date] || [];
                return (
                  <DaySpendingListItem
                    key={day.date}
                    day={day}
                    items={items}
                    isClient={isClient}
                    month={month}
                    businessDayBudget={businessDayBudget}
                    holidayBudget={holidayBudget}
                    updateDaySpending={(items) =>
                      updateDaySpendingByDate(day.date, items)
                    }
                  />
                );
              })}
            </ol>
          </>
        ) : (
          <div>loading...</div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Home;
