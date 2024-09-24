'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { List as ListIcon } from '@phosphor-icons/react/dist/ssr/List';

import { IncidentMap } from './incident-map';
import { Sidebar } from './sidebar';

export function IncidentView({ incidents }) {
  const [openSidebar, setOpenSidebar] = React.useState(false);
  const [currentIncidentId, setCurrentIncidentId] = React.useState(incidents[0]?.id);

  const handleIncidentSelect = React.useCallback((incidentId) => {
    setCurrentIncidentId(incidentId);
  }, []);

  const handleIncidentDeselect = React.useCallback(() => {
    setCurrentIncidentId(undefined);
  }, []);

  const handleSidebarOpen = React.useCallback(() => {
    setOpenSidebar(true);
  }, []);

  const handleSidebarClose = React.useCallback(() => {
    setOpenSidebar(false);
  }, []);

  return (
    <Box sx={{ display: 'flex', flex: '1 1 0', minHeight: 0 }}>
      <Sidebar
        currentIncidentId={currentIncidentId}
        onClose={handleSidebarClose}
        onIncidentDeselect={handleIncidentDeselect}
        onIncidentSelect={handleIncidentSelect}
        open={openSidebar}
        incidents={incidents}
      />
      <Box sx={{ display: 'flex', flex: '1 1 auto', flexDirection: 'column', overflow: 'hidden' }}>
        <Stack direction="row" spacing={1} sx={{ p: 2 }}>
          <Button
            onClick={handleSidebarOpen}
            startIcon={<ListIcon />}
            sx={{ ml: 'auto' }} // Align to the right
          >
            Инциденты
          </Button>
        </Stack>
        <IncidentMap
          currentIncidentId={currentIncidentId}
          onIncidentSelect={handleIncidentSelect}
          incidents={incidents}
        />
      </Box>
    </Box>
  );
}



