import { initTRPC } from "@trpc/server";

const t = initTRPC.create();

const logger = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;
  result.ok
    ? console.log("[trpc] OK", { path, type, durationMs })
    : console.error("[trpc] NG", { path, type, durationMs });

  return result;
});

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure.use(logger);
export const mergeRouters = t.mergeRouters;
