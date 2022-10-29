import { mergeRouters } from "../trpc";
import { helloRouter } from "./hello";

export const appRouter = mergeRouters(helloRouter);

export type AppRouter = typeof appRouter;
