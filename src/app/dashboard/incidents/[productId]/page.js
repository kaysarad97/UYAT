import * as React from 'react';
import RouterLink from 'next/link';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowLeft as ArrowLeftIcon } from '@phosphor-icons/react/dist/ssr/ArrowLeft';

import { config } from '@/config';
import { paths } from '@/paths';
import { ProductEditForm } from '@/components/dashboard/incidents/product-edit-form';

export const metadata = { title: `Details | Incidents | Dashboard | ${config.site.name}` };


export default function Page() {
  return (
    <Box
      sx={{
        maxWidth: 'var(--Content-maxWidth)',
        m: 'var(--Content-margin)',
        p: 'var(--Content-padding)',
        width: 'var(--Content-width)',
      }}
    >
      <Stack spacing={4}>
        <Stack spacing={3}>
          <div>
            <Link
              color="text.primary"
              component={RouterLink}
              href={paths.dashboard.incidents.list}
              sx={{ alignItems: 'center', display: 'inline-flex', gap: 1 }}
              variant="subtitle2"
            >
              
            </Link>
          </div>
          <div>
            <Typography variant="h4">История проишествий</Typography>
          </div>
        </Stack>
        <ProductEditForm
          product={{
            id: 'PRD-001',
            name: '',
            handle: '',
            category: '',
            type: 'physical',
            description:
              '<h2>ТЕСТ</h2><p>ТЕСТ</p>',
            tags: '',
            // currency: 'USD',
            // price: ,
            images: [{ id: 'IMG-001', url: '/assets/auto1.png', fileName: 'auto1  .png' }],
            sku: '401_1BBXBK',
            barcode: '',
            quantity: 10,
            backorder: true,
            height: 25,
            width: 15,
            length: 5,
            weight: 0.25,
          }}
        />
      </Stack>
    </Box>
  );
}
