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
  day,
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
  const saveEdit = useCallback(
    (items: SpendingItem[]) => {
      setIsEditing(false);
      updateDaySpending(items);
    },
    [updateDaySpending]
  );
  const cancelEdit = useCallback(() => {
    setIsEditing(false);
  }, []);

  const listItemStyle = [
    styles.listItem,
    isClient && isToday(month, day.date) && styles.listItemFocused,
  ].join(" ");

  if (isEditing) {
    return (
      <li key={day.date} className={listItemStyle}>
        <div style={{ marginLeft: "8px" }}>
          <DayEditor
            day={day}
            items={items}
            saveEdit={saveEdit}
            cancelEdit={cancelEdit}
          />
        </div>
      </li>
    );
  }

  const amounts = items.map((item) => item.amount);
  const total = sum(amounts);
  const budget = day.isHoliday ? holidayBudget : businessDayBudget;
  const diff = budget - total;
  const diffStr = diff >= 0 ? `${diff}+` : `${-diff}-`;
  const rowStr = `${amounts.join("+")} = ${total} (${diffStr})`;
  return (
    <li key={day.date} className={listItemStyle}>
      <div
        onClick={startEdit}
        style={{ display: "inline-block", marginLeft: "8px" }}
      >
        {amounts.length ? (
          rowStr
        ) : (
          <span style={{ color: "var(--text-sub)" }}>NO DATA</span>
        )}
      </div>
    </li>
  );
};
