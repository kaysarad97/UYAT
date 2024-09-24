'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { EyeSlash as EyeSlashIcon } from '@phosphor-icons/react/dist/ssr/EyeSlash';
import { Controller, useForm } from 'react-hook-form';

import { z } from 'zod';

import { paths } from '@/paths';
import { authClient } from '@/lib/auth/custom/client';
import { useUser } from '@/hooks/use-user';

const schema = z.object({
  username: z.string().min(1, { message: 'Username is required' }),
  password: z.string().min(1, { message: 'Password is required' }),
});

const defaultValues = { username: '', password: '' };

export function SignInForm() {
  const router = useRouter();
  const { checkSession } = useUser();

  const [showPassword, setShowPassword] = React.useState(false);
  const [isPending, setIsPending] = React.useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({ defaultValues, resolver: zodResolver(schema) });

  const onSubmit = React.useCallback(
    async (values) => {
      setIsPending(true);

      const { error } = await authClient.signInWithPassword(values);

if (error) {
  setError('root', { type: 'server', message: error });
  setIsPending(false);
  return;
}

// Proceed with the session check and page refresh if no error
await checkSession?.();
router.refresh();
    },
    [checkSession, router, setError]
  );

  return (
    <Stack style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-block', fontSize: 0 }}>
          <Typography variant="h5">UYAT</Typography>
        </Box>
      </div>
      <Stack spacing={1}>
        <Divider />
        <Typography variant="h5">Добро пожаловать!</Typography>
        <Typography color="text.secondary" variant="body2">
          {/* Optional subtitle or description */}
        </Typography>
      </Stack>
      <Stack spacing={3}>
        <Stack spacing={2}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
              <Controller
                control={control}
                name="username"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.username)}>
                    <InputLabel>Username</InputLabel>
                    <OutlinedInput {...field} type="text" />
                    {errors.username && <FormHelperText>{errors.username.message}</FormHelperText>}
                  </FormControl>
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <FormControl error={Boolean(errors.password)}>
                    <InputLabel>Пароль</InputLabel>
                    <OutlinedInput
                      {...field}
                      endAdornment={
                        showPassword ? (
                          <EyeIcon
                            cursor="pointer"
                            fontSize="var(--icon-fontSize-md)"
                            onClick={() => setShowPassword(false)}
                          />
                        ) : (
                          <EyeSlashIcon
                            cursor="pointer"
                            fontSize="var(--icon-fontSize-md)"
                            onClick={() => setShowPassword(true)}
                          />
                        )
                      }
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                    />
                    {errors.password && <FormHelperText>{errors.password.message}</FormHelperText>}
                  </FormControl>
                )}
              />
              {errors.root ? <Alert color="error">{errors.root.message}</Alert> : null}
              <Button disabled={isPending} type="submit" variant="contained">
                Войти
              </Button>
            </Stack>
          </form>
          <div>
            <Link component={RouterLink} href={paths.auth.custom.resetPassword} variant="subtitle2">
              Забыли пароль
            </Link>
          </div>
        </Stack>
      </Stack>
      <Alert>
        Use{' '}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          username
        </Typography>{' '}
        with password{' '}
        <Typography component="span" sx={{ fontWeight: 700 }} variant="inherit">
          password
        </Typography>
      </Alert>
    </Stack>
  );
}