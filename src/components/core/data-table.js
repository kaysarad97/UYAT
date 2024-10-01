'use client';

import * as React from 'react';
import Checkbox from '@mui/material/Checkbox';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

export function DataTable({
  columns,
  hideHead,
  hover,
  onClick,
  rows,
  uniqueRowId,
  ...props
}) {
  return (
    <Table {...props}>
      <TableHead sx={{ ...(hideHead && { visibility: 'collapse', '--TableCell-borderWidth': 0 }) }}>
        <TableRow>
          {columns.map((column) => (
            <TableCell
              key={column.name}
              sx={{
                width: column.width,
                minWidth: column.width,
                maxWidth: column.width,
                ...(column.align && { textAlign: column.align }),
              }}
            >
              {column.hideName ? null : column.name}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {rows.map((row, index) => {
          const rowId = row.id ? row.id : uniqueRowId?.(row);

          return (
            <TableRow
              hover={hover}
              key={rowId ?? index}
              {...(onClick && {
                onClick: (event) => {
                  onClick(event, row);
                },
              })}
              sx={{ ...(onClick && { cursor: 'pointer' }) }}
            >
              {columns.map((column) => (
                <TableCell key={column.name} sx={{ ...(column.align && { textAlign: column.align }) }}>
                  {column.formatter ? column.formatter(row, index) : column.field ? row[column.field] : null}
                </TableCell>
              ))}
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
