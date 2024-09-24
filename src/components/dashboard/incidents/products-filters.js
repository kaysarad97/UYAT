'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { paths } from '@/paths';
import { FilterButton, FilterPopover, useFilterContext } from '@/components/core/filter-button';
import { Option } from '@/components/core/option';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { dayjs } from '@/lib/dayjs';

// The tabs should be generated using API data.
const tabs = [
  { label: 'Все', value: '', count: 5 },
  { label: '', value: 'published', count: 3 },
  { label: '', value: 'draft', count: 2 },
];

export function ProductsFilters({ filters = {}, sortDir = 'desc' }) {
  const { category, set_employee, status, sku } = filters;

  const router = useRouter();

  const updateSearchParams = React.useCallback(
    (newFilters, newSortDir) => {
      const searchParams = new URLSearchParams();

      if (newSortDir === 'asc') {
        searchParams.set('sortDir', newSortDir);
      }

      if (newFilters.status) {
        searchParams.set('status', newFilters.status);
      }

      if (newFilters.sku) {
        searchParams.set('sku', newFilters.sku);
      }

      if (newFilters.category) {
        searchParams.set('category', newFilters.category);
      }

      if (newFilters.set_employee) {
        searchParams.set('set_employee', newFilters.set_employee);
      }

      router.push(`${paths.dashboard.incidents.list}?${searchParams.toString()}`);
    },
    [router]
  );

  const handleClearFilters = React.useCallback(() => {
    updateSearchParams({}, sortDir);
  }, [updateSearchParams, sortDir]);

  const handleStatusChange = React.useCallback(
    (_, value) => {
      updateSearchParams({ ...filters, status: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handleCategoryChange = React.useCallback(
    (value) => {
      updateSearchParams({ ...filters, category: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handleEmployeeChange = React.useCallback(
    (value) => {
      updateSearchParams({ ...filters, set_employee: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handleSkuChange = React.useCallback(
    (value) => {
      updateSearchParams({ ...filters, sku: value }, sortDir);
    },
    [updateSearchParams, filters, sortDir]
  );

  const handleSortChange = React.useCallback(
    (event) => {
      updateSearchParams(filters, event.target.value);
    },
    [updateSearchParams, filters]
  );

  const hasFilters = status || category || sku || set_employee;

  return (
    <div>
      <Tabs onChange={handleStatusChange} sx={{ px: 3 }} value={status ?? ''} variant="scrollable">
        {tabs.map((tab) => (
          <Tab
            icon={<Chip label={tab.count} size="small" variant="soft" />}
            iconPosition="end"
            key={tab.value}
            label={tab.label}
            sx={{ minHeight: 'auto' }}
            tabIndex={0}
            value={tab.value}
          />
        ))}
      </Tabs>
      <Divider />
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', p: 2 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flex: '1 1 auto', flexWrap: 'wrap' }}>
          <FilterButton
            displayValue={category || undefined}
            label="Тип проишествий"
            onFilterApply={(value) => {
              handleCategoryChange(value);
            }}
            onFilterDelete={() => {
              handleCategoryChange();
            }}
            popover={<CategoryFilterPopover />}
            value={category || undefined}
          />
         <FilterButton
            displayValue={set_employee || undefined}
            label="Назначенный сотрудник"
            onFilterApply={(value) => {
              handleEmployeeChange(value);
            }}
            onFilterDelete={() => {
              handleEmployeeChange();
            }}
            popover={<EmployeeFilterPopover />}
            value={set_employee || undefined}
          />

         
          <DatePicker
            displayValue={sku || undefined}
            format="MMM D, YYYY"
            onChange={() => {
              // noop
            }}
            sx={{ maxWidth: '100%', width: '240px' }}
            value={dayjs().subtract(1, 'month')}
            // value={ undefined}
          />
          {hasFilters ? <Button onClick={handleClearFilters}>Clear filters</Button> : null}
        </Stack>
      </Stack>
    </div>
  );
}

function CategoryFilterPopover() {
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    setValue(initialValue ?? '');
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="По типу">
      <FormControl>
        <Select
          onChange={(event) => {
            setValue(event.target.value);
          }}
          value={value}
        >
          <Option value="">Выберите тип проишествий</Option>
          <Option value="ПДД">ПДД</Option>
          <Option value="Превышение">Превышение</Option>
          <Option value="Кража">Кража</Option>
        </Select>
      </FormControl>
      <Button
        onClick={() => {
          onApply(value);
        }}
        variant="contained"
      >
        Выбрать
      </Button>
    </FilterPopover>
  );
}

function EmployeeFilterPopover() {
  const { anchorEl, onApply, onClose, open, value: initialValue } = useFilterContext();
  const [value, setValue] = React.useState('');

  React.useEffect(() => {
    setValue(initialValue ?? '');
  }, [initialValue]);

  return (
    <FilterPopover anchorEl={anchorEl} onClose={onClose} open={open} title="Назначенный сотрудник">
      <FormControl>
        <OutlinedInput
          onChange={(event) => {
            setValue(event.target.value);
          }}
          onKeyUp={(event) => {
            if (event.key === 'Enter') {
              onApply(value);
            }
          }}
          value={value}
        />
      </FormControl>
      <Button
        onClick={() => {
          onApply(value);
        }}
        variant="contained"
      >
        Выбрать
      </Button>
    </FilterPopover>
  );
}
