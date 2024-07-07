# Checkers :: Corners App (corners.crf.mn)

> The game "Corners" is played on a chess board using a standard set of checkers or chess
> pieces of two colors, all of equal value. Players set up their pieces in the corners of
> the board in configurations such as three rows of three pieces each. These positions,
> filled with pieces, are called "Cities." The setup can vary, such as two rows of four
> pieces, or using 16 pieces if preferred.

> At the start, players agree on the initial arrangement. A variant places checkers along
> the board corner, called "galmi." The game with more checkers is longer and more complex
> due to frequent player bottlenecks.

> In "Corners," the winner is the first to move all their pieces to the opponent's city
> and occupy the territory. A draw is declared if the second player achieves the same
> immediately after the first. Pieces move in any direction except diagonally, advancing
> or jumping over any pieces, without stepping over multiple pieces at once. The number
> of jumps per move is only limited by board possibilities.

> Players cannot block an opponent's pieces completely. If one player moves all their pieces
> out of their city, the other must do the same. The game can end after 80 moves without
> a final position occupied, with the winner being the one who moved the most pieces into
> enemy territory. A repeated board setup three times also results in a draw.

## Version

**v1.0.0**

## Requirements

1. `docker`
2. `docker compose`
3. `make`

## Setup

1. Copy appropriate env file, depending on your environment:
```sh
cp env.sample.[ENV] env.app
```

2. Set up your environment variables inside copied file

## Run

1. use `pnpm`:
```sh
pnpm i
pnpm dev
```

2. or **docker** and **make**:
```sh
make dev.up
```

## GIT

1. For proper git commit messages, use:
- `git config commit.template .gitmessage`

Please, follow `commitlint` rules to make a good commit message

## Runtime

1. App requires **[Node.js](https://nodejs.org/)** v20.7+ to run.
2. Language: **[Typescript](https://www.typescriptlang.org/)** v5+
3. Packager: **[pnpm](https://pnpm.io/)** 

## Packages

App is using following [npm-package](https://www.npmjs.com/)

| Package | Version |
| ------ | ------ |
| ***Production dependencies*** |
| [@crfmn/use-audio](https://npmjs.com/package/@crfmn/use-audio) | ^1.0.2 |
| [@dnd-kit/core](https://npmjs.com/package/@dnd-kit/core) | ^6.1.0 |
| [@faker-js/faker](https://npmjs.com/package/@faker-js/faker) | ^8.4.1 |
| [@hookform/resolvers](https://npmjs.com/package/@hookform/resolvers) | ^3.6.0 |
| [@lucia-auth/adapter-prisma](https://npmjs.com/package/@lucia-auth/adapter-prisma) | ^4.0.1 |
| [@prisma/client](https://npmjs.com/package/@prisma/client) | ^5.16.1 |
| [@radix-ui/react-context-menu](https://npmjs.com/package/@radix-ui/react-context-menu) | ^2.2.1 |
| [@radix-ui/react-dialog](https://npmjs.com/package/@radix-ui/react-dialog) | ^1.1.1 |
| [@radix-ui/react-dropdown-menu](https://npmjs.com/package/@radix-ui/react-dropdown-menu) | ^2.1.1 |
| [@radix-ui/react-label](https://npmjs.com/package/@radix-ui/react-label) | ^2.1.0 |
| [@radix-ui/react-menubar](https://npmjs.com/package/@radix-ui/react-menubar) | ^1.1.1 |
| [@radix-ui/react-scroll-area](https://npmjs.com/package/@radix-ui/react-scroll-area) | ^1.1.0 |
| [@radix-ui/react-separator](https://npmjs.com/package/@radix-ui/react-separator) | ^1.1.0 |
| [@radix-ui/react-slot](https://npmjs.com/package/@radix-ui/react-slot) | ^1.1.0 |
| [@radix-ui/react-tabs](https://npmjs.com/package/@radix-ui/react-tabs) | ^1.1.0 |
| [@radix-ui/react-toast](https://npmjs.com/package/@radix-ui/react-toast) | ^1.2.1 |
| [@radix-ui/react-tooltip](https://npmjs.com/package/@radix-ui/react-tooltip) | ^1.1.2 |
| [@radix-ui/themes](https://npmjs.com/package/@radix-ui/themes) | ^3.1.1 |
| [@supabase/supabase-js](https://npmjs.com/package/@supabase/supabase-js) | ^2.44.2 |
| [@t3-oss/env-nextjs](https://npmjs.com/package/@t3-oss/env-nextjs) | ^0.10.1 |
| [@tanstack/react-query](https://npmjs.com/package/@tanstack/react-query) | ^5.49.2 |
| [@tanstack/react-query-devtools](https://npmjs.com/package/@tanstack/react-query-devtools) | ^5.49.2 |
| [@trpc/client](https://npmjs.com/package/@trpc/client) | 11.0.0-rc.373 |
| [@trpc/react-query](https://npmjs.com/package/@trpc/react-query) | 11.0.0-rc.373 |
| [@trpc/server](https://npmjs.com/package/@trpc/server) | 11.0.0-rc.373 |
| [@uidotdev/usehooks](https://npmjs.com/package/@uidotdev/usehooks) | ^2.4.1 |
| [axios](https://npmjs.com/package/axios) | ^1.7.2 |
| [class-variance-authority](https://npmjs.com/package/class-variance-authority) | ^0.7.0 |
| [clsx](https://npmjs.com/package/clsx) | ^2.1.1 |
| [dayjs](https://npmjs.com/package/dayjs) | ^1.11.11 |
| [framer-motion](https://npmjs.com/package/framer-motion) | ^11.2.12 |
| [i18next](https://npmjs.com/package/i18next) | ^23.11.5 |
| [i18next-browser-languagedetector](https://npmjs.com/package/i18next-browser-languagedetector) | ^8.0.0 |
| [i18next-http-backend](https://npmjs.com/package/i18next-http-backend) | ^2.5.2 |
| [js-cookie](https://npmjs.com/package/js-cookie) | ^3.0.5 |
| [json-schema-to-ts](https://npmjs.com/package/json-schema-to-ts) | ^3.1.0 |
| [lucia](https://npmjs.com/package/lucia) | ^3.2.0 |
| [lucide-react](https://npmjs.com/package/lucide-react) | ^0.399.0 |
| [next](https://npmjs.com/package/next) | ^14.2.4 |
| [next-themes](https://npmjs.com/package/next-themes) | ^0.3.0 |
| [react](https://npmjs.com/package/react) | 18.3.1 |
| [react-dom](https://npmjs.com/package/react-dom) | 18.3.1 |
| [react-hook-form](https://npmjs.com/package/react-hook-form) | ^7.52.0 |
| [react-i18next](https://npmjs.com/package/react-i18next) | ^14.1.2 |
| [rxdb](https://npmjs.com/package/rxdb) | ^15.25.0 |
| [rxjs](https://npmjs.com/package/rxjs) | ^7.8.1 |
| [server-only](https://npmjs.com/package/server-only) | ^0.0.1 |
| [socket.io](https://npmjs.com/package/socket.io) | ^4.7.5 |
| [socket.io-client](https://npmjs.com/package/socket.io-client) | ^4.7.5 |
| [superjson](https://npmjs.com/package/superjson) | ^2.2.1 |
| [tailwind-merge](https://npmjs.com/package/tailwind-merge) | ^2.3.0 |
| [type-fest](https://npmjs.com/package/type-fest) | ^4.20.1 |
| [usehooks-ts](https://npmjs.com/package/usehooks-ts) | ^3.1.0 |
| [uuid](https://npmjs.com/package/uuid) | ^10.0.0 |
| [uuid-by-string](https://npmjs.com/package/uuid-by-string) | ^4.0.0 |
| [zod](https://npmjs.com/package/zod) | ^3.23.8 |
| [zustand](https://npmjs.com/package/zustand) | ^4.5.4 |
| ***Development dependencies*** |
| [@commitlint/cli](https://npmjs.com/package/@commitlint/cli) | ^19.3.0 |
| [@commitlint/config-conventional](https://npmjs.com/package/@commitlint/config-conventional) | ^19.2.2 |
| [@playwright/test](https://npmjs.com/package/@playwright/test) | ^1.45.0 |
| [@testing-library/jest-dom](https://npmjs.com/package/@testing-library/jest-dom) | ^6.4.6 |
| [@testing-library/react](https://npmjs.com/package/@testing-library/react) | ^16.0.0 |
| [@types/eslint](https://npmjs.com/package/@types/eslint) | ^8.56.10 |
| [@types/jest](https://npmjs.com/package/@types/jest) | ^29.5.12 |
| [@types/js-cookie](https://npmjs.com/package/@types/js-cookie) | ^3.0.6 |
| [@types/node](https://npmjs.com/package/@types/node) | ^20.14.9 |
| [@types/react](https://npmjs.com/package/@types/react) | ^18.3.3 |
| [@types/react-dom](https://npmjs.com/package/@types/react-dom) | ^18.3.0 |
| [@types/uuid](https://npmjs.com/package/@types/uuid) | ^10.0.0 |
| [@typescript-eslint/eslint-plugin](https://npmjs.com/package/@typescript-eslint/eslint-plugin) | ^7.14.1 |
| [@typescript-eslint/parser](https://npmjs.com/package/@typescript-eslint/parser) | ^7.14.1 |
| [autoprefixer](https://npmjs.com/package/autoprefixer) | ^10.4.19 |
| [eslint](https://npmjs.com/package/eslint) | ^8.57.0 |
| [eslint-config-next](https://npmjs.com/package/eslint-config-next) | ^14.2.4 |
| [eslint-config-prettier](https://npmjs.com/package/eslint-config-prettier) | ^9.1.0 |
| [eslint-plugin-prettier](https://npmjs.com/package/eslint-plugin-prettier) | ^5.1.3 |
| [eslint-plugin-simple-import-sort](https://npmjs.com/package/eslint-plugin-simple-import-sort) | ^12.1.0 |
| [eslint-plugin-tailwindcss](https://npmjs.com/package/eslint-plugin-tailwindcss) | ^3.17.4 |
| [eslint-plugin-unused-imports](https://npmjs.com/package/eslint-plugin-unused-imports) | ^4.0.0 |
| [husky](https://npmjs.com/package/husky) | ^9.0.11 |
| [jest](https://npmjs.com/package/jest) | ^29.7.0 |
| [jest-environment-jsdom](https://npmjs.com/package/jest-environment-jsdom) | ^29.7.0 |
| [lint-staged](https://npmjs.com/package/lint-staged) | ^15.2.7 |
| [next-sitemap](https://npmjs.com/package/next-sitemap) | ^4.2.3 |
| [postcss](https://npmjs.com/package/postcss) | ^8.4.39 |
| [prettier](https://npmjs.com/package/prettier) | ^3.3.2 |
| [prettier-plugin-tailwindcss](https://npmjs.com/package/prettier-plugin-tailwindcss) | ^0.6.5 |
| [prisma](https://npmjs.com/package/prisma) | ^5.16.1 |
| [tailwindcss](https://npmjs.com/package/tailwindcss) | ^3.4.4 |
| [tailwindcss-animate](https://npmjs.com/package/tailwindcss-animate) | ^1.0.7 |
| [tsx](https://npmjs.com/package/tsx) | ^4.16.0 |
| [typescript](https://npmjs.com/package/typescript) | ^5.5.2 |

## License

MIT