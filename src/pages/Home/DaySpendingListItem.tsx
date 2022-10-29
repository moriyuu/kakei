import { useCallback, useState } from "react";

import styles from "./DaySpendingListItem.module.css";
import { isToday } from "../../utils/day";
import { DayEditor } from "../../components/DayEditor";
import { sum } from "../../utils";
import {
  Day,
  Month,
  SavedSpendingItem,
  UnsavedSpendingItem,
} from "../../utils/types";
import { useReplaceSpendingItems } from "./hooks/useReplaceSpendingItems";
import { Loading } from "../../components/Loading";

type Props = {
  day: Day;
  items: SavedSpendingItem[];
  isClient: boolean;
  month: Month;
  businessDayBudget: number;
  holidayBudget: number;
};

export const DaySpendingListItem = ({
  day,
  items,
  isClient,
  month,
  businessDayBudget,
  holidayBudget,
}: Props) => {
  const { replaceSpendingItemsOfDay, status, error } =
    useReplaceSpendingItems();

  const [isEditing, setIsEditing] = useState(false);

  const startEdit = useCallback(() => {
    setIsEditing(true);
  }, []);
  const saveEdit = useCallback(
    (items: UnsavedSpendingItem[]) => {
      setIsEditing(false);
      replaceSpendingItemsOfDay(day, items);
    },
    [replaceSpendingItemsOfDay, day]
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
        style={{
          marginLeft: "8px",
          color: status === "loading" ? "var(--text-sub)" : "inherit",
        }}
      >
        {amounts.length ? (
          <span>{rowStr}</span>
        ) : (
          <span style={{ color: "var(--text-sub)" }}>NO DATA</span>
        )}
        {status === "loading" && (
          <span style={{ marginLeft: "5px" }}>
            <Loading />
          </span>
        )}

        {error && (
          <div style={{ fontFamily: "monospace", color: "var(--text-error)" }}>
            error: {error.message}
          </div>
        )}
      </div>
    </li>
  );
};
