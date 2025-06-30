// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export default clerkMiddleware((auth, req) => {
  return NextResponse.next();
});

export const config = {
  matcher: [
    // ✅ Match everything except public/static assets
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
