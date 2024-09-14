// middleware.ts

import { withMiddlewareAuthRequired } from '@auth0/nextjs-auth0/edge';

// Ref Doc: https://auth0.github.io/nextjs-auth0/types/helpers_with_middleware_auth_required.WithMiddlewareAuthRequired.html

export default withMiddlewareAuthRequired();

export const config = {
  // These routes are protected from unauthenticated users
  matcher: ['/courses/:path*'],
};
