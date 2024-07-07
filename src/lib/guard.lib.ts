import type { RouteLeaf } from '~/type/route.type';
import type { User } from '~prisma';

export const isUser = (input: User | unknown): input is User =>
  !!(input as User).id && !!(input as User).email;

export const isError = (input: Error | unknown): input is Error =>
  !!(input as Error).message;

export const isRouteLeaf = (route: RouteLeaf | string): route is RouteLeaf =>
  typeof route === 'object' && route !== null;
