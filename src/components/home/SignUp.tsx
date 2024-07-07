'use client';

import { type FC } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { signUpLucia } from '~/app/action/sign-up';
import { Button } from '~/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '~/components/ui/form';
import { Input } from '~/components/ui/input';
import { useToast } from '~/components/ui/use-toast';
import { cn } from '~/lib/util.lib';

const signUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: '2 или более символов' })
    .max(12, { message: '12 или менее символов' })
    .regex(/^[\p{L}\p{M}\p{Zs}-]+$/u, {
      message: 'imya-mozhet-soderzhat-tolko-bukvy-probely-i-defis',
    }),
  sessionId: z.string().uuid(),
});

type SignUpSchema = z.infer<typeof signUpSchema>;

const SignUp: FC<{
  sessionId: string;
}> = ({ sessionId }) => {
  const form = useForm<SignUpSchema>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      sessionId,
    },
  });

  const { t } = useTranslation();

  const { toast } = useToast();

  const onSubmit = async (data: SignUpSchema) => {
    const dataToSend = new FormData();

    dataToSend.append('name', data.name);
    dataToSend.append('sessionId', data.sessionId);

    signUpLucia(dataToSend)
      .then((response) => {
        if (response?.error) {
          toast({
            description: response?.error ?? t('ne-proshla-validaciya-imeni'),
            variant: 'destructive',
          });
        } else {
          toast({ description: t('signed-in') });

          window.location.href = '/' + data.sessionId;
        }
      })
      .catch((error) => {
        toast({ description: error.message });
        return null;
      });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-[calc(100vh/3)] flex flex-col items-center justify-center gap-3"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="w-full md:w-4/5">
              <FormControl>
                <Input
                  placeholder={t('vvedite-svoe-imya')}
                  className={cn(
                    'h-24 w-full text-center text-5xl font-thin md:h-32 md:text-7xl',
                    form.formState.errors.name && 'border-destructive',
                  )}
                  {...field}
                />
              </FormControl>
              {form.formState.errors.name?.message && (
                <p>{t(form.formState.errors.name.message)}</p>
              )}
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sessionId"
          render={({ field }) => (
            <FormItem className="w-full md:w-4/5">
              <FormControl>
                <Input
                  placeholder={t('vvedite-svoe-imya')}
                  className={cn(
                    'hidden h-24 w-full text-center text-5xl font-thin md:h-32 md:text-7xl',
                    form.formState.errors.sessionId && 'border-destructive',
                  )}
                  {...field}
                />
              </FormControl>
              {form.formState.errors.sessionId?.message && (
                <p>{t(form.formState.errors.sessionId.message)}</p>
              )}
            </FormItem>
          )}
        />
        <Button
          variant="secondary"
          type="submit"
          className="h-16 w-full text-3xl md:h-24 md:w-4/5 md:text-5xl"
        >
          {t('nachat')}
        </Button>
      </form>
    </Form>
  );
};

export default SignUp;
