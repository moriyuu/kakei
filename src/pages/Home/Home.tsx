import type { NextPage } from "next";
import { useState, useEffect, useMemo, useCallback } from "react";
import dayjs from "dayjs";
import copy from "copy-to-clipboard";

import styles from "./Home.module.css";
import { Footer } from "../../components/Footer";
import { sum } from "../../utils";
import { Month, toMonth } from "../../utils/types";
import { Head } from "./Head";
import { Header } from "./Header";
import { DaySpendingListItem } from "./DaySpendingListItem";
import { useSurplus } from "./hooks/useSurplus";
import { useBudget } from "./hooks/useBudget";
import { useDaySpendings } from "./hooks/useDaySpendings";
import { getDaysOfMonth } from "../../utils/day";
import { useSpendingItems } from "./hooks/useSpendingItems";
import { useLastUpdate } from "./hooks/useLastUpdate";

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
  const { spendingItems, isLoading } = useSpendingItems({ month });
  const daySpendings = useDaySpendings({ spendingItems: spendingItems ?? [] });
  const surplus = useSurplus({
    daySpendings,
    days,
    businessDayBudget,
    holidayBudget,
  });
  const lastUpdate = useLastUpdate({ spendingItems: spendingItems ?? [] });

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
        const amounts = items.map((item) => item.amount);
        const dayTotal = sum(amounts);
        const budget = isHoliday ? holidayBudget : businessDayBudget;
        const diff = budget - dayTotal;
        const diffStr = diff >= 0 ? `${diff}+` : `${-diff}-`;
        const rowStr = `${date}. ${items
          .map(
            (item) => `${item.amount}${item.comment ? `(${item.comment})` : ""}`
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

        {!isLoading ? (
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
                  />
                );
              })}
            </ol>
          </>
        ) : (
          <div>loading...</div>
        )}

        {lastUpdate && (
          <div className={styles.lastUpdate}>last update: {lastUpdate}</div>
        )}

        <Footer />
      </div>
    </>
  );
};

export default Home;
