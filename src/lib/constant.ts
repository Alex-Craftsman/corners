import { env } from '~/env.mjs';
import type { TBoard } from '~/type/game.type';

export const siteConfigConst = {
  title: 'corners • уголки',
  description:
    'Цель игры в уголки - быстрее оппонента передвинуть все свои шашки на то место, где изначально располагались его шашки',
  keywords: [
    'Next.js',
    'React',
    'Tailwind CSS',
    'TypeScript',
    'Shadcn/ui',
    'Lucia-auth',
    'Prisma',
  ],
  url: env.NEXT_PUBLIC_SITE_URL || 'https://corners.crf.mn',
  googleSiteVerificationId: env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION_ID || '',
};

export type GameFlavor = 'standard' | 'line' | 'diagonal';

export const GameFlavorArray: GameFlavor[] = ['standard', 'line', 'diagonal'];

export const initialBoardConst: Record<GameFlavor, TBoard> = {
  standard: [
    ['checker-p1-1', 'checker-p1-2', 'checker-p1-3', '', '', '', '', ''],
    ['checker-p1-4', 'checker-p1-5', 'checker-p1-6', '', '', '', '', ''],
    ['checker-p1-7', 'checker-p1-8', 'checker-p1-9', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', 'checker-p2-1', 'checker-p2-2', 'checker-p2-3'],
    ['', '', '', '', '', 'checker-p2-4', 'checker-p2-5', 'checker-p2-6'],
    ['', '', '', '', '', 'checker-p2-7', 'checker-p2-8', 'checker-p2-9'],
  ],
  line: [
    [
      'checker-p1-1',
      'checker-p1-2',
      'checker-p1-3',
      'checker-p1-4',
      '',
      '',
      '',
      '',
    ],
    [
      'checker-p1-5',
      'checker-p1-6',
      'checker-p1-7',
      'checker-p1-8',
      '',
      '',
      '',
      '',
    ],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    [
      '',
      '',
      '',
      '',
      'checker-p2-1',
      'checker-p2-2',
      'checker-p2-3',
      'checker-p2-4',
    ],
    [
      '',
      '',
      '',
      '',
      'checker-p2-5',
      'checker-p2-6',
      'checker-p2-7',
      'checker-p2-8',
    ],
  ],
  diagonal: [
    [
      'checker-p1-1',
      'checker-p1-2',
      'checker-p1-3',
      'checker-p1-4',
      '',
      '',
      '',
      '',
    ],
    ['checker-p1-5', 'checker-p1-6', 'checker-p1-7', '', '', '', '', ''],
    ['checker-p1-8', 'checker-p1-9', '', '', '', '', '', ''],
    ['checker-p1-10', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', 'checker-p2-10'],
    ['', '', '', '', '', '', 'checker-p2-9', 'checker-p2-8'],
    ['', '', '', '', '', 'checker-p2-7', 'checker-p2-6', 'checker-p2-5'],
    [
      '',
      '',
      '',
      '',
      'checker-p2-4',
      'checker-p2-3',
      'checker-p2-2',
      'checker-p2-1',
    ],
  ],
} as const;

export const rowCountConst = 8 as const;
export const colCountConst = 8 as const;

export const colLabelConst = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
export const rowLabelConst = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const loserBoardConst: Record<GameFlavor, TBoard> = {
  standard: initialBoardConst.standard.map<string[]>((row) =>
    row.map<string>((cell) => {
      const [_checker, player, _index] = cell.split('-', 3);

      if (!player) {
        return '';
      }

      return player;
    }),
  ),
  line: initialBoardConst.line.map<string[]>((row) =>
    row.map<string>((cell) => {
      const [_checker, player, _index] = cell.split('-', 3);

      if (!player) {
        return '';
      }

      return player;
    }),
  ),
  diagonal: initialBoardConst.diagonal.map<string[]>((row) =>
    row.map<string>((cell) => {
      const [_checker, player, _index] = cell.split('-', 3);

      if (!player) {
        return '';
      }

      return player;
    }),
  ),
};

export const winnerBoardConst: Record<GameFlavor, TBoard> = {
  standard: initialBoardConst.standard.map<string[]>((row) =>
    row.map<string>((cell) => {
      const [_checker, player, _index] = cell.split('-', 3);

      if (!player) {
        return '';
      }

      return player === 'p1' ? 'p2' : 'p1';
    }),
  ),
  line: initialBoardConst.line.map<string[]>((row) =>
    row.map<string>((cell) => {
      const [_checker, player, _index] = cell.split('-', 3);

      if (!player) {
        return '';
      }

      return player === 'p1' ? 'p2' : 'p1';
    }),
  ),
  diagonal: initialBoardConst.diagonal.map<string[]>((row) =>
    row.map<string>((cell) => {
      const [_checker, player, _index] = cell.split('-', 3);

      if (!player) {
        return '';
      }

      return player === 'p1' ? 'p2' : 'p1';
    }),
  ),
};
