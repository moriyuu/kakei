import { inferAsyncReturnType } from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";

export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  return {
    session: "foo", // TODO:
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
