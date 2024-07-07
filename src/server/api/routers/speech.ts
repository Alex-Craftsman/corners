import axios from 'axios';
import fs from 'fs';
import path from 'path';
import getUuid from 'uuid-by-string';
import { z } from 'zod';

import { env } from '~/env.mjs';
import { latinize } from '~/lib/latinize.lib';
import { createTRPCRouter, protectedProcedure } from '~/server/api/trpc';
import { type Locale, LocaleEnum } from '~/type/i18n.type';

export const speechRouter = createTRPCRouter({
  getSpeech: protectedProcedure
    .input(
      z.object({
        text: z.string(),
        locale: z.string().min(2).max(2),
      }),
    )
    .mutation(async ({ ctx: _, input }) => {
      const locale: Locale = input.locale as Locale;

      if ([LocaleEnum.ru, LocaleEnum.en].indexOf(locale) === -1) {
        throw new Error('Unsupported locale');
      }

      let text = input.text;

      if (locale === LocaleEnum.en) {
        text = latinize(text, true);
      }

      const hints = {
        text,
        hints:
          locale === LocaleEnum.ru
            ? [
                {
                  voice: 'marina',
                },
                {
                  role: 'friendly',
                },
              ]
            : [
                {
                  voice: 'john',
                },
              ],
        outputAudioSpec: {
          containerAudio: {
            containerAudioType: 'MP3',
          },
        },
      };

      const soundId = getUuid(JSON.stringify(hints));

      const fileUrl = `/api/sound/${soundId}`;

      const filePath = path.join(
        process.cwd(),
        'public',
        's',
        `${soundId}.mp3`,
      );

      // check file existence
      if (fs.existsSync(filePath)) {
        return {
          soundId,
          fileUrl,
          filePath,
        };
      }

      try {
        const result = await axios({
          method: 'POST',
          url: 'https://tts.api.cloud.yandex.net/tts/v3/utteranceSynthesis',
          responseType: 'json',
          headers: {
            Authorization: 'Api-Key ' + env.YC_SECRET,
          },
          data: hints,
        });

        if (!result.data) {
          return {
            soundId,
            fileUrl,
            filePath,
          };
        }

        let audioData: string = '';

        if (typeof result.data === 'string') {
          const audioChunks = result.data.split('\n');

          for (let i = 0; i < audioChunks.length; i++) {
            const audioChunk = audioChunks[i];

            try {
              if (audioChunk) {
                const audioChunkData = JSON.parse(audioChunk);

                if (audioChunkData.result.audioChunk.data) {
                  audioData += audioChunkData.result.audioChunk.data;
                }
              }
            } catch (e) {
              audioData += '';
            }
          }
        } else {
          audioData = result.data.result.audioChunk.data;
        }

        if (!audioData) {
          return {
            soundId,
            fileUrl,
            filePath,
          };
        }

        const buffer = Buffer.from(audioData, 'base64');

        fs.writeFile(filePath, buffer, (err) => {
          if (err) {
            console.error('Error writing file:', err);
          }
        });
      } catch (error) {
        console.error('Error:', error, {
          input,
          hints,
        });
      }

      return {
        soundId,
        fileUrl,
        filePath,
      };
    }),
});
