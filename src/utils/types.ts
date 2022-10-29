import { MicroCMSListContent } from "microcms-js-sdk";
import { z } from "zod";

export type Date = number & { __DateBrand: never };
export const fromDate = (date: Date): number => date;
export const toDate = (date: number): Date => date as Date;

export type Month = string & { __MonthBrand: never }; // 'YYYY-MM' の形式
export const fromMonth = (month: Month): string => month;
export const toMonth = (month: string): Month => month as Month;

export type Day = { date: Date; isHoliday: boolean; datetime: number };

export const UnsavedSpendingItem = z.object({
  amount: z.number(),
  comment: z.string(),
  spentAt: z.string({ description: "ISO 8601 の形式" }),
  order: z.number(),
});
export type UnsavedSpendingItem = z.infer<typeof UnsavedSpendingItem>;
export type SavedSpendingItem = UnsavedSpendingItem & MicroCMSListContent;
export type SpendingItem = UnsavedSpendingItem | SavedSpendingItem;
