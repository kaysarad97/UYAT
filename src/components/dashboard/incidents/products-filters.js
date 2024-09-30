'use client';

import * as React from 'react';
import { Stack, Select, MenuItem, Button } from '@mui/material';

export function ProductsFilters({ filters, onChange, tags = [] }) { // tags имеет значение по умолчанию - пустой массив
  const handleStatusChange = (event) => {
    onChange({ ...filters, status: event.target.value });
  };

  const handleDateFilterChange = (event) => {
    onChange({ ...filters, date_filter: event.target.value });
  };

  const handleTagFilterChange = (event) => {
    const newTag = event.target.value; // Объявляем 'newTag'
    console.log("Selected tag:", newTag); // Отслеживаем выбранный тег
    onChange({ ...filters, tag: event.target.value });
  };

  const handleClearFilters = () => {
    onChange({ status: '', date_filter: '', tag: '' });
  };

  return (
    <Stack direction="row" spacing={2} sx={{ p: 2 }}>
      {/* Фильтр по статусу */}
      <Select value={filters.status} onChange={handleStatusChange} displayEmpty>
        <MenuItem value=""><em>Все статусы</em></MenuItem>
        <MenuItem value="Отправлено">Отправлено</MenuItem>
        <MenuItem value="В работе">В работе</MenuItem>
        <MenuItem value="Завершено">Завершено</MenuItem>
      </Select>

      {/* Фильтр по дате */}
      <Select value={filters.date_filter} onChange={handleDateFilterChange} displayEmpty>
        <MenuItem value=""><em>Все даты</em></MenuItem>
        <MenuItem value="today">Сегодня</MenuItem>
        <MenuItem value="3_days">Последние 3 дня</MenuItem>
        <MenuItem value="week">Последняя неделя</MenuItem>
      </Select>

      {/* Фильтр по тегам */}
      <Select value={filters.tag} onChange={handleTagFilterChange} displayEmpty>
        <MenuItem value=""><em>Все категории</em></MenuItem>
        {tags.length > 0 ? (
          tags.map((tag) => (
            <MenuItem key={tag.short_version} value={tag.short_version}>
              {tag.short_version}
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled value="">
            Нет доступных тегов
          </MenuItem>
        )}
      </Select>

      {/* Кнопка очистки фильтров */}
      <Button onClick={handleClearFilters}>Очистить фильтры</Button>
    </Stack>
  );
}
