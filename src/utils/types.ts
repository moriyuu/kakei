export type Date = number & { __DateBrand: never };
export const fromDate = (date: Date): number => date;
export const toDate = (date: number): Date => date as Date;

export type Month = string & { __MonthBrand: never }; // 'YYYY-MM' の形式
export const fromMonth = (month: Month): string => month;
export const toMonth = (month: string): Month => month as Month;

export type Day = { date: Date; isHoliday: boolean; datetime: number };

export type SpendingItem = {
  id: string;
  amount: number;
  comment: string;
  spentAt: string;
};
