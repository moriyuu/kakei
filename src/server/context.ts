import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const idToken =
    (opts.req.headers["authorization"]?.toString() ?? "").split(" ")[1] || null;
  return {
    idToken,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
