
import { NextResponse } from 'next/server';
import { account } from '@/lib/appwrite/client/appwrite';

export async function middleware(req) {
  //  try {
  //     const user = await account.get();

  //     if (user) {
  //        return NextResponse.next();
  //     }
  //  } catch (error) {
  //     console.error("Authentication error:", error);
  //  }

  //  const url = req.nextUrl.clone();
  //  url.pathname = '/login';
  //  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}