import { useState } from "react";
import { SettingPalette } from "../../components/SettingPalette";
import * as Icons from "../../components/icons";
import { Month, toMonth } from "../../utils/types";

type Props = {
  month: Month;
  changeMonth: (month: Month) => void;
  businessDayBudget: number;
  holidayBudget: number;
  updateBudgetSetting: (
    businessDayBudget: number,
    holidayBudget: number
  ) => void;
  copyContentAsText: () => void;
  copyContentAsCsv: () => void;
};

export const Header = ({
  month,
  changeMonth,
  businessDayBudget,
  holidayBudget,
  updateBudgetSetting,
  copyContentAsText,
  copyContentAsCsv,
}: Props) => {
  const [showSettingPalette, setShowSettingPalette] = useState(false);

  return (
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
          onChange={(e) => changeMonth(toMonth(e.target.value))}
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
                businessDayBudget={businessDayBudget}
                holidayBudget={holidayBudget}
                onChangeBudget={updateBudgetSetting}
                copyContentAsText={copyContentAsText}
                copyContentAsCsv={copyContentAsCsv}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
