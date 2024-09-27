'use client';

import * as React from 'react';
import { Stack, Select, MenuItem, Button } from '@mui/material';

export function ProductsFilters({ filters, onChange }) {
  const handleStatusChange = (event) => {
    onChange({ ...filters, status: event.target.value });
  };

  const handleDateFilterChange = (event) => {
    onChange({ ...filters, date_filter: event.target.value });
  };

  const handleClearFilters = () => {
    onChange({ status: '', date_filter: '' });
  };

  return (
    <Stack direction="row" spacing={2} sx={{ p: 2 }}>
      <Select value={filters.status} onChange={handleStatusChange} displayEmpty>
        <MenuItem value=""><em>Все статусы</em></MenuItem>
        <MenuItem value="Отправлено">Отправлено</MenuItem>
        <MenuItem value="В работе">В работе</MenuItem>
        <MenuItem value="Завершено">Завершено</MenuItem>
      </Select>

      <Select value={filters.date_filter} onChange={handleDateFilterChange} displayEmpty>
        <MenuItem value=""><em>Все даты</em></MenuItem>
        <MenuItem value="today">Сегодня</MenuItem>
        <MenuItem value="3_days">Последние 3 дня</MenuItem>
        <MenuItem value="week">Последняя неделя</MenuItem>
      </Select>

      <Button onClick={handleClearFilters}>Очистить фильтры</Button>
    </Stack>
  );
}
