import { type Router } from 'express';
import { authRouter } from './auth/controller';
import { profileRouter } from './profile/controller';
import { sessionRouter } from './session/controller';

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
  },
  {
    path: generatePrefix('/sessions'),
    router: sessionRouter
  }
];

export { routesList };
