'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';

import { NoSsr } from '@/components/core/no-ssr';

const HEIGHT = 100;
const WIDTH = 240;

export function Logo({ height = HEIGHT, width = WIDTH }) {
  const url = '/assets/logo_converted.png'; // Укажите путь к вашему логотипу

  return (
    <Box
      alt="logo"
      component="img"
      src={url}
      sx={{ height: `${height}px`, width: `${width}px` }} // Управляем размерами через sx
    />
  );
}

export function DynamicLogo({
  colorDark = 'light',
  colorLight = 'dark',
  height = HEIGHT,
  width = WIDTH,
  ...props
}) {
  const { colorScheme } = useColorScheme();
  const color = colorScheme === 'dark' ? colorDark : colorLight;

  return (
    <NoSsr fallback={<Box sx={{ height: `${height}px`, width: `${width}px` }} />}>
      <Logo color={color} height={height} width={width} {...props} />
    </NoSsr>
  );
}
