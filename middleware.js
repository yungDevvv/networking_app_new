import { NextResponse } from 'next/server';
import { getLoggedInUser } from './lib/appwrite/server/appwrite';


export async function middleware(request) {
  const publicPaths = [
    '/login',
    '/register',
    '/reset-password',
    '/update-password',
  ];

  if (publicPaths.some((path) => request.nextUrl.pathname.startsWith(path))) {
    return NextResponse.next();
  }

  try {
   
    const user = await getLoggedInUser(); 

    if (user) {
      return NextResponse.next(); 
    }
  } catch (error) {
    console.error('Error fetching user:', error); 
  }

  const url = request.nextUrl.clone();
  url.pathname = '/login';
  return NextResponse.redirect(url);
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
