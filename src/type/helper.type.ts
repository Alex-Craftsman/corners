export type Nullable<T> = T | null;

export interface FindOne<T> {
  found: Nullable<T>;
}

export interface Count {
  total: number;
}
