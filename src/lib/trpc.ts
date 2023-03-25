import { httpBatchLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import type { AppRouter } from "../server/routers/_app";
import * as firebase from "./firebase";

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return ""; // browser should use relative path
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const trpc = createTRPCNext<AppRouter>({
  config({ ctx }) {
    return {
      links: [
        httpBatchLink({
          url: `${getBaseUrl()}/api/trpc`,
          headers: async () => {
            const idToken = await firebase.getIdToken();
            return {
              Authorization: `Bearer ${idToken}`,
            };
          },
        }),
      ],
    };
  },
  ssr: false,
});
