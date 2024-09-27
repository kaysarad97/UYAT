'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import { useColorScheme } from '@mui/material/styles';
import { NoSsr } from '@/components/core/no-ssr';

const HEIGHT = 500;
const WIDTH = 500;

export function Logo({ height = HEIGHT, width = WIDTH }) {
  const url = '/assets/logo.jpg'; // Specify the correct path to your logo

  return (
    <Box
      component="img"
      alt="logo"
      src={url}
      sx={{
        height: `${height}px`,
        width: `${width}px`,
        objectFit: 'contain', // Ensure the logo maintains its aspect ratio
        objectPosition: 'center', // Center the logo within the box
      }}
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
