import React, { useState, useCallback } from "react";
import { Yen, toYen } from "../utils/types";

type Props = {
  yens: Yen[];
  saveEdit: (yens: Yen[]) => void;
  cancelEdit: () => void;
};

export const DayEditor = ({ yens, saveEdit, cancelEdit }: Props) => {
  const [value, setValue] = useState(yens.join("+"));
  const [error, setError] = useState(false);

  const save = useCallback(() => {
    const yens = value
      .split("+")
      .map((n) => parseInt(n, 10))
      .map(toYen);
    const hasError = yens.some((y) => isNaN(y));
    if (value.trim() === "") {
      saveEdit([]);
    } else if (hasError) {
      setError(true);
      setTimeout(() => setError(false), 500);
    } else {
      saveEdit(yens);
    }
  }, [value, saveEdit]);

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
