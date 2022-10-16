import dayjs from "dayjs";
import { Date } from "./types";

/**
 * @param month YYYY-MM
 */
export const isThisMonth = (month: string) =>
  month === dayjs().format("YYYY-MM");

/**
 * @param month YYYY-MM
 * @param date Date
 */
export const isToday = (month: string, date: Date) => {
  return isThisMonth(month) && date === dayjs().date();
};
