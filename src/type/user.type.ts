import type { User } from '~prisma';

export type TUserContext = {
  user: User | null;
};
