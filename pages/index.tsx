import type { NextPage } from "next";
import Head from "next/head";
import { useState, useEffect, useMemo, useCallback } from "react";
import * as holiday_jp from "@holiday-jp/holiday_jp";
import dayjs from "dayjs";
import copy from "copy-to-clipboard";

import styles from "../styles/Home.module.css";
import { DayEditor } from "../components/DayEditor";
import { SettingPalette } from "../components/SettingPalette";
import { Footer } from "../components/Footer";
import * as Icons from "../components/icons";
import { sum } from "../utils";
import * as store from "../utils/store";
import { Date, toDate, Items } from "../utils/types";
import { isToday } from "../utils/day";

const useBudget = () => {
  const [businessDayBudget, setBusinessDayBudget] = useState<number>(2000);
  const [holidayBudget, setHolidayBudget] = useState<number>(3000);

  const budget = (isHoliday: boolean) =>
    isHoliday ? holidayBudget : businessDayBudget;

  const updateBudgetSetting = (
    businessDayBudget: number,
    holidayBudget: number
  ) => {
    setBusinessDayBudget(businessDayBudget);
    setHolidayBudget(holidayBudget);
    store.save("budget", { businessDayBudget, holidayBudget });
  };

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
    budget,
    updateBudgetSetting,
  };
};

const getDays = (month: string) => {
  const daysNum = dayjs(month).daysInMonth();
  const days: { date: Date; isHoliday: boolean }[] = Array.from(
    { length: daysNum },
    (_, i) => {
      const date = toDate(i + 1);
      const day = dayjs(month).date(date).toDate();
      const isSat = day.getDay() === 6;
      const isSun = day.getDay() === 0;
      const isHoliday = holiday_jp.isHoliday(day);
      return { date, isHoliday: isSat || isSun || isHoliday };
    }
  );
  return days;
};

const Home: NextPage = () => {
  const { budget, updateBudgetSetting } = useBudget();

  //
  // states
  //
  const [isClient, setIsClient] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [month, setMonth] = useState(dayjs().format("YYYY-MM"));
  const [memo, setMemo] = useState("");
  const [editingDays, setEditingDays] = useState<Record<Date, boolean>>({});
  const [data, setData] = useState<Record<Date, Items>>({});
  const [showSettingPalette, setShowSettingPalette] = useState(false);

  //
  // memos
  //
  const days = useMemo(() => getDays(month), [month]);
  const surplus = useMemo(
    () =>
      Object.keys(data)
        .map((date) => toDate(Number(date)))
        .filter((date) => data[date].length > 0)
        .reduce((memo, date) => {
          const isHoliday =
            days.find((day) => day.date === date)?.isHoliday || false;
          const dayTotal = sum(data[date].map((d) => d.yen));
          const diff = budget(isHoliday) - dayTotal;
          return memo + diff;
        }, 0),
    [data, days, budget]
  );

  //
  // callbacks
  //
  const startEdit = useCallback(
    (date: Date) => {
      setEditingDays({ ...editingDays, [date]: true });
    },
    [editingDays]
  );
  const saveEdit = useCallback(
    (date: Date, items: Items) => {
      setEditingDays({ ...editingDays, [date]: false });
      setData({ ...data, [date]: items });
    },
    [data, editingDays]
  );
  const cancelEdit = useCallback(
    (date: Date) => {
      setEditingDays({ ...editingDays, [date]: false });
    },
    [editingDays]
  );
  const changeMonth = useCallback((month: string) => {
    setMonth(month);
  }, []);
  const copyContentAsText = useCallback(() => {
    const content = days.reduce((memo, { date, isHoliday }) => {
      const items = data[date] || [];
      if (items.length > 0) {
        const yens = items.map((item) => item.yen);
        const dayTotal = sum(yens);
        const diff = budget(isHoliday) - dayTotal;
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
  }, [days, data, budget, surplus]);

  //
  // effects
  //

  useEffect(() => {
    setIsClient(true);
  }, []);

  // initialize data and memo (from store)
  useEffect(() => {
    try {
      const d = store.load<{
        data: Record<Date, Items>;
        memo: string;
      }>("monthData:" + month);
      if (d == null) {
        setData({});
        setMemo("");
      } else {
        setData(d.data);
        setMemo(d.memo);
      }
      setInitialized(true);
    } catch (err) {
      window.alert("failed to load data. Error=" + (err as Error).toString());
    }
  }, [month]);

  // save data and memo to store
  useEffect(() => {
    if (!initialized) {
      return;
    }
    store.save("monthData:" + month, { data, memo });
  }, [initialized, month, data, memo]);

  return (
    <>
      <Head>
        <title>kakei</title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>💸</text></svg>"
        />
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1.0,maximum-scale=1.0"
        />
      </Head>

      <div className={styles.container}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>💸 kakei</h1>

          <div style={{ display: "flex", gap: "4px" }}>
            <input
              type="month"
              value={month}
              onChange={(e) => changeMonth(e.target.value)}
            />
            <div style={{ position: "relative" }}>
              <button
                className="icon"
                style={{ height: "40px", width: "40px" }}
                onClick={() => setShowSettingPalette(!showSettingPalette)}
              >
                <Icons.Gear size={28} />
              </button>
              {showSettingPalette && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "36px",
                    zIndex: 1,
                  }}
                >
                  <SettingPalette
                    budget={budget}
                    onChangeBudget={updateBudgetSetting}
                    copyContentAsText={copyContentAsText}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        <div>surplus: {surplus}</div>

        <ol className={styles.list}>
          {days.map(({ date, isHoliday }) => {
            const items = data[date] || [];
            const listItemStyle = [
              styles.listItem,
              isClient && isToday(month, date) && styles.listItemFocused,
            ].join(" ");

            const isEditing = editingDays[date];
            if (isEditing) {
              return (
                <li key={date} className={listItemStyle}>
                  <div style={{ marginLeft: "8px" }}>
                    <DayEditor
                      items={items}
                      saveEdit={(items) => saveEdit(date, items)}
                      cancelEdit={() => cancelEdit(date)}
                    />
                  </div>
                </li>
              );
            }

            const yens = items.map((item) => item.yen);
            const total = sum(yens);
            const diff = budget(isHoliday) - total;
            const diffStr = diff >= 0 ? `${diff}+` : `${-diff}-`;
            const rowStr = `${yens.join("+")} = ${total} (${diffStr})`;
            return (
              <li key={date} className={listItemStyle}>
                <div
                  onClick={() => startEdit(date)}
                  style={{ display: "inline-block", marginLeft: "8px" }}
                >
                  {yens.length ? (
                    rowStr
                  ) : (
                    <span style={{ color: "var(--text-sub)" }}>NO DATA</span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>

        <div>memo</div>
        <textarea
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          rows={Math.max(5, memo.split("\n").length)}
          style={{ width: "100%" }}
        ></textarea>

        <Footer />
      </div>
    </>
  );
};

export default Home;
