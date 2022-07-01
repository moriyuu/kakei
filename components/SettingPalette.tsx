import { useState, useEffect } from "react";
import styles from "./SettingPalette.module.css";

type Props = {
  budget: (isHoliday: boolean) => number;
  onChangeBudget: (businessDayBudget: number, holidayBudget: number) => void;
  copyContentAsText: () => void;
};

export const SettingPalette = ({
  budget,
  onChangeBudget,
  copyContentAsText,
}: Props) => {
  const [businessDayBudget, setBusinessDayBudget] = useState<number>(
    budget(false)
  );
  const [holidayBudget, setHolidayBudget] = useState<number>(budget(true));
  const [copied, setCopied] = useState<boolean>(false);

  const copyAsText = () => {
    copyContentAsText();
    setCopied(true);
    setTimeout(() => setCopied(false), 500);
  };

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
          {copied ? "copied!" : "copy as text"}
        </button>
      </div>
    </div>
  );
};
