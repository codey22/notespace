import { NextResponse } from 'next/server';

export function middleware(request) {
    const response = NextResponse.next();
    const userId = request.cookies.get('notespace_user_id');

    if (!userId) {
        // Generate a new user ID if one doesn't exist
        response.cookies.set('notespace_user_id', crypto.randomUUID());
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
