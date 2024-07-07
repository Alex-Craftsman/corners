import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import { useAudio } from '@crfmn/use-audio';

import { useLocale } from '~/store/locale.store';
import { api } from '~/trpc/react';
import type { Nullable } from '~/type/helper.type';

const GameWaiting = () => {
  const { t } = useTranslation();

  const { locale } = useLocale();

  const text = useCallback(() => {
    return t('ozhidanie-igrokov-v-igre').split(' ');
  }, [t])();

  const isSoundPlayed = useRef<boolean>(false);

  const [key, setKey] = useState<number>(0);
  const { mutateAsync: getSpeech } = api.speech.getSpeech.useMutation({
    onSuccess: (data) => {
      waitingSoundUrlSet(data.fileUrl);
    },
    onError: (_) => {
      waitingSoundUrlSet(null);
    },
  });

  const [waitingSoundUrl, waitingSoundUrlSet] =
    useState<Nullable<string>>(null);

  const { play: waitingSound, isInit } = useAudio(waitingSoundUrl);

  useEffect(() => {
    getSpeech({
      text: t('ozhidaem-podklyucheniya-partnera'),
      locale,
    });
  }, [getSpeech, t, locale]);

  useEffect(() => {
    setTimeout(() => {
      if (isInit && !isSoundPlayed.current) {
        isSoundPlayed.current = true;

        waitingSound();
      }
    }, 3000);
  }, [isInit, waitingSound]);

  useEffect(() => {
    const interval = setInterval(
      () => {
        setKey((prev) => prev + 1);
      },
      (text.length + 1) * 1000,
    );

    return () => {
      clearInterval(interval);
    };
  }, [text.length]);

  return (
    <span className="mt-[calc(100vh/3)] scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
      {text.map((el, i) => (
        <motion.span
          key={'work-' + i}
          initial={{ opacity: key % 2 ? 0 : 1 }}
          animate={{ opacity: key % 2 ? 1 : 0 }}
          transition={{
            duration: 1,
            delay: i,
          }}
        >
          {el}{' '}
        </motion.span>
      ))}
    </span>
  );
};

export default GameWaiting;
