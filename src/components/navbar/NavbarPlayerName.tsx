import type { Nullable } from '~/type/helper.type';
import type { User } from '~prisma';

const NavbarPlayerName = ({ user }: { user: Nullable<User> }) => {
  return user ? ' • ' + user.name : '';
};

export default NavbarPlayerName;
