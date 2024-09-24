
'use client';

import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { IncidentItem } from './incident-item';

export function IncidentList({ onIncidentDeselect, onIncidentSelect, currentIncidentId, incidents = [] }) {
  if (!Array.isArray(incidents)) {
    console.error("Incidents is not an array", incidents);
    return <div>No incidents available</div>;
  }

  return (
    <TableContainer component={Paper}>
      <Table aria-label="incident table">
        <TableHead>
          <TableRow>
            <TableCell>Наименование</TableCell>
            <TableCell>Тип происшествия</TableCell>
            <TableCell>Назначенный сотрудник</TableCell>
            <TableCell>Создал</TableCell>
            {/* <TableCell>Дата создания</TableCell> */}
            <TableCell>Статус</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {incidents.map((incident) => {
            const selected = currentIncidentId ? currentIncidentId === incident.id : false;
            return (
              <IncidentItem
                key={incident.id}
                onDeselect={onIncidentDeselect}
                onSelect={onIncidentSelect}
                selected={selected}
                incident={incident}
              />
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
