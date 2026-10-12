import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PUBLIC_PATHS = [
  "/",
  "/register",
  "/forgot-password",
  "/reset-password",
];

const ACCESS_TOKEN_COOKIE = "accessToken";

async function isValidToken(token: string): Promise<boolean> {
  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT_SECRET is not configured");
    }

    const secretKey = new TextEncoder().encode(secret);

    await jwtVerify(token, secretKey, {
      algorithms: ["HS256"],
    });

    return true;
  } catch {
    return false;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );

  const accessToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;

  // Protect private pages.
  if (!isPublicPath && !accessToken) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("next", pathname);

    return NextResponse.redirect(loginUrl);
  }

  // Verify the signature and expiration of the JWT.
  if (!isPublicPath && accessToken) {
    const valid = await isValidToken(accessToken);

    if (!valid) {
      const response = NextResponse.redirect(
        new URL("/login?session=expired", request.url)
      );

      response.cookies.delete(ACCESS_TOKEN_COOKIE);
      response.cookies.delete("refreshToken");

      return response;
    }
  }

  // Keep authenticated users away from login/register pages.
  if (isPublicPath && accessToken) {
    const valid = await isValidToken(accessToken);

    if (valid) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};