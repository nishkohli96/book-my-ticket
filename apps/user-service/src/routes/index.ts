import { type Router } from 'express';
import { authRouter } from './auth/controller';

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
  }
];

export { routesList };
