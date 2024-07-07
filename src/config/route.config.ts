export const routesProtected = {
  main: '/game',
  game: {
    root: '/game/:id',
    flavor: '/flavor',
  },
} as const;

export const routesAnonymous = {
  root: '/',
  auth: {
    signIn: '/',
    signUp: '/',
  },
  about: '/about',
} as const;

export const routes = {
  ...routesProtected,
  ...routesAnonymous,
} as const;
