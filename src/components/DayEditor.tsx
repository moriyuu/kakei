import React, { useState, useCallback } from "react";
import { SpendingItem, Day } from "../utils/types";
import { correctItemFormat } from "../utils/format";
import dayjs from "dayjs";

const getId = () => "draft";

type Props = {
  day: Day;
  items: SpendingItem[];
  saveEdit: (items: SpendingItem[]) => void;
  cancelEdit: () => void;
};

export const DayEditor = ({ day, items, saveEdit, cancelEdit }: Props) => {
  const [value, setValue] = useState(
    items
      .map(({ amount, comment }) => `${amount}${comment ? `(${comment})` : ""}`)
      .join("+")
  );
  const [error, setError] = useState(false);

  const save = useCallback(() => {
    try {
      if (value.trim() === "") {
        saveEdit([]);
        return;
      }

      const items: SpendingItem[] = value.split("+").map((item) => {
        const trimed = item.trim();
        if (!correctItemFormat(trimed)) {
          throw new Error("correct item format: " + item);
        }
        const amount = parseInt(trimed.match(/(\d+)/)?.[1] ?? "", 10);
        if (isNaN(amount)) {
          throw new Error("amount is NaN: " + item);
        }
        const comment = trimed.match(/\((.*)\)/)?.[1] ?? "";
        return {
          id: getId(),
          amount,
          comment,
          spentAt: dayjs(day.datetime).toISOString(),
        };
      });
      saveEdit(items);
    } catch (err) {
      console.error(err);
      setError(true);
      setTimeout(() => setError(false), 500);
    }
  }, [value, saveEdit, day.datetime]);

  const onSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      save();
    },
    [save]
  );

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
          style={{ width: "100%" }}
        />
        <div
          style={{ display: "flex", justifyContent: "right", marginTop: "4px" }}
        >
          <button
            type="button"
            onClick={cancelEdit}
            style={{
              background: "transparent",
              border: "transparent",
              color: "var(--text-sub)",
            }}
          >
            cancel
          </button>
          <button type="submit" style={{ color: error ? "red" : "#000" }}>
            {error ? "error!" : "save"}
          </button>
        </div>
      </form>
    </div>
  );
};
