// app/api/auth/[auth0]/route.ts

import { handleAuth } from '@auth0/nextjs-auth0';
import { logger } from '@/utils';

const log = logger.child({ module: 'app/api/auth/[auth0]/route.ts' });

log.info('Using Auth0 for authentication');

/*
  This creates the following routes:

  * /api/auth/login: The route used to perform login with Auth0.
  * /api/auth/logout: The route used to log the user out.
  * /api/auth/callback: The route Auth0 will redirect the user to after a successful login.
  * /api/auth/me: The route to fetch the user profile from.
  * 
*/

export const GET = handleAuth();
