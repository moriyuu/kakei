export type Yen = number & { __YenBrand: never };
export const fromYen = (yen: Yen): number => yen;
export const toYen = (yen: number): Yen => yen as Yen;

export type Date = number & { __DateBrand: never };
export const fromDate = (date: Date): number => date;
export const toDate = (date: number): Date => date as Date;

export type Month = string & { __MonthBrand: never }; // 'YYYY-MM' の形式
export const fromMonth = (month: Month): string => month;
export const toMonth = (month: string): Month => month as Month;

export type Day = { date: Date; isHoliday: boolean };

export type SpendingItem = { yen: Yen; comment: string | null };
