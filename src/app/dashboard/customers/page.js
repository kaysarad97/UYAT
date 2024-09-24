'use client';  // Это делает компонент клиентским

import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import { fetchApiWithAuth } from '@/lib/auth/custom/client';  // Импортируем функцию для работы с API

export default function Page({ searchParams }) {
  const { email, phone, sortDir, status } = searchParams;
  const [employees, setEmployees] = React.useState([]);  // Используем состояние для сотрудников

  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await fetchApiWithAuth('http://37.99.82.96:8000/api/v1/employee/', {
          method: 'GET',
        });
        setEmployees(data);  // Устанавливаем данные сотрудников
      } catch (error) {
        console.error('Error fetching employees:', error);
      }
    };

    fetchEmployees();
  }, []);

  // Применяем сортировку и фильтры
  const filteredEmployees = applyFilters(employees, { email, phone, status });
  const sortedEmployees = applySort(filteredEmployees, sortDir);

  return (
    <Box sx={{ maxWidth: 'var(--Content-maxWidth)', m: 'var(--Content-margin)', p: 'var(--Content-padding)', width: 'var(--Content-width)' }}>
      <Stack spacing={4}>
        <Typography variant="h4">Меню Оператора</Typography>
        <Card>
          <CustomersFilters filters={{ email, phone, status }} sortDir={sortDir} />
          <Divider />
          <Box sx={{ overflowX: 'auto' }}>
            <CustomersTable rows={sortedEmployees} />
          </Box>
        </Card>
      </Stack>
    </Box>
  );
}

function applySort(rows, sortDir) {
  return rows.sort((a, b) => {
    if (sortDir === 'asc') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function applyFilters(rows, { email, phone, status }) {
  return rows.filter((item) => {
    if (email && !item.email?.toLowerCase().includes(email.toLowerCase())) return false;
    if (phone && !item.phone?.toLowerCase().includes(phone.toLowerCase())) return false;
    if (status && item.status !== status) return false;
    return true;
  });
}
