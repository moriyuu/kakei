import { useState, useEffect, useCallback } from "react";
import styles from "./SettingPalette.module.css";

type Props = {
  businessDayBudget: number;
  holidayBudget: number;
  onChangeBudget: (businessDayBudget: number, holidayBudget: number) => void;
  copyContentAsText: () => void;
  copyContentAsCsv: () => void;
};

export const SettingPalette = ({
  businessDayBudget: businessDayBudgetProp,
  holidayBudget: holidayBudgetProp,
  onChangeBudget,
  copyContentAsText,
  copyContentAsCsv,
}: Props) => {
  const [businessDayBudget, setBusinessDayBudget] = useState<number>(
    businessDayBudgetProp
  );
  const [holidayBudget, setHolidayBudget] = useState<number>(holidayBudgetProp);
  const [copied, setCopied] = useState<"text" | "csv" | null>(null);

  const copyAsText = useCallback(() => {
    copyContentAsText();
    setCopied("text");
    setTimeout(() => setCopied(null), 500);
  }, [copyContentAsText]);

  const copyAsCsv = useCallback(() => {
    copyContentAsCsv();
    setCopied("csv");
    setTimeout(() => setCopied(null), 500);
  }, [copyContentAsCsv]);

  useEffect(() => {
    onChangeBudget(businessDayBudget, holidayBudget);
  }, [onChangeBudget, businessDayBudget, holidayBudget]);

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.subhead}>budget</div>
        <div>
          <form onSubmit={(e) => e.preventDefault()}>
            <span style={{ marginRight: "10px" }}>business day:</span>
            <input
              type="number"
              value={businessDayBudget}
              onChange={(e) =>
                setBusinessDayBudget(parseInt(e.target.value, 10))
              }
              style={{ width: "50px" }}
            />
          </form>
          <div>
            <span style={{ marginRight: "10px" }}>holiday:</span>
            <input
              type="number"
              value={holidayBudget}
              onChange={(e) => setHolidayBudget(parseInt(e.target.value, 10))}
              style={{ width: "50px" }}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.subhead}>export</div>
        <button onClick={copyAsText}>
          {copied === "text" ? "copied!" : "copy as text"}
        </button>
        <br />
        <button onClick={copyAsCsv}>
          {copied === "csv" ? "copied!" : "copy as csv"}
        </button>
      </div>
    </div>
  );
};
