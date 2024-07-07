'use client'; // Error components must be Client Components

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

import { Button } from '~/components/ui/button';

export default function Error404({
  error,
  reset: _reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center text-center">
      <div>
        <h1 className="mb-4 text-2xl font-semibold">
          {t('404-page-not-found')}
        </h1>
        <Link href="/">
          <Button>{t('go-to-home')}</Button>
        </Link>
      </div>
    </div>
  );
}
