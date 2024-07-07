export type RouteLeaf = {
  [key: string]: string;
};

export type RouteProtectedObject = {
  root: string;
  library: RouteLeaf;
};

export type RouteAnonymousObject = {
  root: string;
  auth: RouteLeaf;
};
