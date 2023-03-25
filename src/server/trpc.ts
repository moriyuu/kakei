import { initTRPC, TRPCError } from "@trpc/server";
import { Context } from "./context";
import * as firebaseAuth from "../lib/firebaseAdmin";

const t = initTRPC.context<Context>().create();

const logger = t.middleware(async ({ path, type, next }) => {
  const start = Date.now();
  const result = await next();
  const durationMs = Date.now() - start;
  result.ok
    ? console.log("OK", { path, type, durationMs })
    : console.log("NG", { path, type, durationMs });

  return result;
});

const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!process.env.AVAILABLE_EMAILS) {
    throw new TRPCError({
      message: "environment variable AVAILABLE_EMAILS not set",
      code: "INTERNAL_SERVER_ERROR",
    });
  }

  if (!ctx.idToken) {
    throw new TRPCError({ message: "idToken required", code: "UNAUTHORIZED" });
  }

  const decodedIdToken = await firebaseAuth.verifyIdToken(ctx.idToken);
  if (!decodedIdToken) {
    throw new TRPCError({
      message: "idToken verification failed",
      code: "UNAUTHORIZED",
    });
  }

  if (!decodedIdToken.email) {
    throw new TRPCError({
      message: "email not found",
      code: "UNAUTHORIZED",
    });
  }

  if (!process.env.AVAILABLE_EMAILS.includes(decodedIdToken.email)) {
    throw new TRPCError({
      message: "your email not available",
      code: "FORBIDDEN",
    });
  }

  return next({
    ctx: {
      uid: decodedIdToken.uid,
      email: decodedIdToken.email,
    },
  });
});

export const middleware = t.middleware;
export const router = t.router;
export const publicProcedure = t.procedure.use(logger).use(isAuthed);
export const mergeRouters = t.mergeRouters;
