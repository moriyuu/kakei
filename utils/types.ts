export type Yen = number & { __YenBrand: never };
export const fromYen = (yen: Yen): number => yen;
export const toYen = (yen: number): Yen => yen as Yen;

export type Date = number & { __DateBrand: never };
export const fromDate = (date: Date): number => date;
export const toDate = (date: number): Date => date as Date;
