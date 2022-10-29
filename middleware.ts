import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const logger = (request: NextRequest) => {
  const url = new URL(request.url);
  if (url.pathname.startsWith("/api")) {
    console.log("[nextjs]", request.method, request.url, request.body);
  }
};

export function middleware(request: NextRequest) {
  logger(request);

  return NextResponse.next();
}
