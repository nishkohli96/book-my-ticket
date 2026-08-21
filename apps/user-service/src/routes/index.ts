import { type Router } from 'express';
import { authRouter } from './auth/controller';
import { profileRouter } from './profile/controller';

type RouteInfo = {
  path: string;
  router: Router;
};

function generatePrefix(routeName: string) {
  return `/api/user${routeName}`;
}

const routesList: RouteInfo[] = [
  {
    path: generatePrefix('/auth'),
    router: authRouter
  },
  {
    path: generatePrefix('/profile'),
    router: profileRouter
  }
];

export { routesList };
