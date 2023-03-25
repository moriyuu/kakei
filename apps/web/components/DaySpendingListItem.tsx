import { useCallback, useState } from "react";

import styles from "./DaySpendingListItem.module.css";
import { isToday } from "../utils/day";
import { DayEditor } from "./DayEditor";
import { sum } from "../utils";
import { SpendingItem, Day, Month } from "../utils/types";

type Props = {
  day: Day;
  items: SpendingItem[];
  isClient: boolean;
  month: Month;
  businessDayBudget: number;
  holidayBudget: number;
  updateDaySpending: (items: SpendingItem[]) => void;
};

export const DaySpendingListItem = ({
  day: { date, isHoliday },
  items,
  isClient,
  month,
  businessDayBudget,
  holidayBudget,
  updateDaySpending,
}: Props) => {
  const [isEditing, setIsEditing] = useState(false);

  const startEdit = useCallback(() => {
    setIsEditing(true);
  }, []);
  const saveEdit = useCallback((items: SpendingItem[]) => {
    setIsEditing(false);
    updateDaySpending(items);
  }, []);
  const cancelEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  const listItemStyle = [
    styles.listItem,
    isClient && isToday(month, date) && styles.listItemFocused,
  ].join(" ");

  if (isEditing) {
    return (
      <li key={date} className={listItemStyle}>
        <div style={{ marginLeft: "8px" }}>
          <DayEditor
            items={items}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
          />
        </div>
      </li>
    );
  }

  const yens = items.map((item) => item.yen);
  const total = sum(yens);
  const budget = isHoliday ? holidayBudget : businessDayBudget;
  const diff = budget - total;
  const diffStr = diff >= 0 ? `${diff}+` : `${-diff}-`;
  const rowStr = `${yens.join("+")} = ${total} (${diffStr})`;
  return (
    <li key={date} className={listItemStyle}>
      <div
        onClick={startEdit}
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
};
