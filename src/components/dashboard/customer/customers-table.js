import * as React from 'react';
import Link from 'next/link'; // Import Link from Next.js
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box'; // Import Box from MUI
import { PencilSimple as PencilSimpleIcon, TrashSimple as TrashSimpleIcon } from '@phosphor-icons/react/dist/ssr';
import { DataTable } from '@/components/core/data-table';
import { useCustomersSelection } from './customers-selection-context';

// Function to delete a customer
const deleteCustomer = async (id) => {
  if (!window.confirm('Вы уверены, что хотите удалить сотрудника? Это действие необратимо.')) {
    return;
  }

  try {
    const response = await fetch(`http://37.99.82.96:8000/api/v1/employee/${id}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Ошибка удаления сотрудника');
    }

    alert('Сотрудник успешно удален');
    // Optionally, reload the page or remove the deleted customer from the state
    window.location.reload();
  } catch (err) {
    alert('Не удалось удалить сотрудника.');
  }
};

// Table columns
const columns = [
  {
    formatter: (row) => (
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <div>
          <Typography variant="subtitle2">{row.name}</Typography>
          <Typography color="text.secondary" variant="body2">
            {row.surname}
          </Typography>
        </div>
      </Stack>
    ),
    name: 'Имя и Фамилия',
    width: '250px',
  },
  { field: 'role', name: 'Роль', width: '150px' },
  { field: 'tabel_id', name: 'Табельный номер', width: '150px' },
  { field: 'patrol_id', name: 'Patrol ID', width: '150px' }, // Add patrol_id field
  { field: 'office_id', name: 'Office ID', width: '150px' }, // Add office_id field
  {
    formatter: (row) => (
      <Link href={`/dashboard/customers/${row.id}`} passHref>
        <IconButton>
          <PencilSimpleIcon />
        </IconButton>
      </Link>
    ),
    name: 'Изменить',
    hideName: true,
    width: '100px',
    align: 'right',
  },
  {
    formatter: (row) => (
      <IconButton onClick={() => deleteCustomer(row.id)}>
        <TrashSimpleIcon />
      </IconButton>
    ),
    name: 'Удалить',
    hideName: true,
    width: '100px',
    align: 'right',
  },
];

// CustomersTable component
export function CustomersTable({ rows }) {
  const { deselectAll, deselectOne, selectAll, selectOne, selected } = useCustomersSelection();

  // Логи для отладки
  React.useEffect(() => {
    console.log('Rows data:', rows);
    console.log('Selected items:', selected);
  }, [rows, selected]);

  const handleSelectOne = (_, row) => {
    console.log('Selecting row:', row.id); // Лог при выборе строки
    selectOne(row.id); // Ensure correct ID is passed
  };

  const handleDeselectOne = (_, row) => {
    console.log('Deselecting row:', row.id); // Лог при отмене выбора строки
    deselectOne(row.id); // Ensure correct ID is passed
  };

  const handleSelectAll = () => {
    console.log('Selecting all rows'); // Лог для выбора всех строк
    selectAll(); // Handle select all rows
  };

  const handleDeselectAll = () => {
    console.log('Deselecting all rows'); // Лог для отмены выбора всех строк
    deselectAll(); // Handle deselect all rows
  };

  return (
    <React.Fragment>
      <DataTable
        columns={columns}
        onDeselectAll={handleDeselectAll} // Pass handleDeselectAll
        onDeselectOne={handleDeselectOne} // Pass handleDeselectOne
        onSelectAll={handleSelectAll} // Pass handleSelectAll
        onSelectOne={handleSelectOne} // Pass handleSelectOne
        rows={rows}
        selectable
        selected={selected} // Pass selected rows
      />
      {!rows.length ? (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
            Не найдено сотрудников
          </Typography>
        </Box>
      ) : null}
    </React.Fragment>
  );
}
