import dayjs from "dayjs";
import * as holiday_jp from "@holiday-jp/holiday_jp";
import { Date, Month, Day, toDate } from "./types";

/**
 * @param month YYYY-MM
 */
export const isThisMonth = (month: Month) =>
  month === dayjs().format("YYYY-MM");

/**
 * @param month YYYY-MM
 * @param date Date
 */
export const isToday = (month: Month, date: Date) => {
  return isThisMonth(month) && date === dayjs().date();
};

export const getDaysOfMonth = (month: Month): Day[] => {
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
