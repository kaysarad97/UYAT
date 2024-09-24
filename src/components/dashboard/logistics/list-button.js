'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import { UploadSimple as UploadSimpleIcon } from '@phosphor-icons/react/dist/ssr/UploadSimple';

import { useDialog } from '@/hooks/use-dialog';

import { Uploader } from './table-list';

export function UploadButton() { // Fixed the typo here
  const uploadList = useDialog();

  return (
    <React.Fragment>
      <Button onClick={uploadList.handleOpen} startIcon={<UploadSimpleIcon />} variant="contained">
        Список проишествий
      </Button>
      <Uploader onClose={uploadList.handleClose} open={uploadList.open} />
    </React.Fragment>
  );
}
