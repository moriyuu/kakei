import { mergeRouters } from "../trpc";
import { helloRouter } from "./hello";
import { spendingItemsRouter } from "./spendingItems";

export const appRouter = mergeRouters(helloRouter, spendingItemsRouter);

export type AppRouter = typeof appRouter;
