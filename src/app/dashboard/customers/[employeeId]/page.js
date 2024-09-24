'use client';

import * as React from 'react';
import { useRouter, useParams } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';
import { toast } from '@/components/core/toaster';

export default function EmployeeDetailsPage() {
  const router = useRouter();
  const { employeeId } = useParams();
  const [employee, setEmployee] = React.useState({
    name: '',
    surname: '',
    role: '',
    tabel_id: '',
    patrol_id: '',
    office_id: '',
  });

  const [isLoading, setIsLoading] = React.useState(true);
  const [isSaving, setIsSaving] = React.useState(false);

  // Fetch employee details
  React.useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await fetch(`http://37.99.82.96:8000/api/v1/employee/${employeeId}`, {
          method: 'GET',
        });
        if (!response.ok) {
          throw new Error('Ошибка при загрузке данных сотрудника');
        }
        const data = await response.json();
        setEmployee(data);
        setIsLoading(false);
      } catch (error) {
        toast.error('Ошибка при загрузке данных сотрудника');
      }
    };

    if (employeeId) {
      fetchEmployee();
    }
  }, [employeeId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEmployee((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const queryParams = new URLSearchParams({
        name: employee.name,
        surname: employee.surname,
        role: employee.role,
        tabel_id: employee.tabel_id,
        patrol_id: employee.patrol_id,
        office_id: employee.office_id,
      }).toString();
  
      // Формируем URL с параметрами
      const apiUrl = `http://37.99.82.96:8000/api/v1/employee/${employeeId}/update?${queryParams}`;
  
      // Отправляем PATCH-запрос без body, используя URL с параметрами
      const response = await fetch(apiUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json', // Хотя body не используется, можно оставить заголовок для совместимости.
        },
      });
  
      if (!response.ok) {
        const errorMessage = await response.text();
        toast.error(`Ошибка при обновлении данных сотрудника: ${errorMessage}`);
        throw new Error('Failed to update employee data');
      }
  
      toast.success('Данные сотрудника успешно обновлены');
      router.push('/dashboard/customers');
    } catch (error) {
      toast.error('Не удалось обновить данные сотрудника');
    } finally {
      setIsSaving(false);
    }
  };
  

  if (isLoading) {
    return <LinearProgress />;
  }

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f4f6f8',
        padding: 0,
        margin: 0,
      }}
    >
      <Card
        sx={{
          width: '80%',
          height: '80%',
          maxWidth: '900px',
          maxHeight: '80%',
          borderRadius: '16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardHeader
          title="Редактировать данные сотрудника"
          sx={{
            backgroundColor: 'primary.main',
            color: 'white',
            textAlign: 'center',
            py: 3,
            fontSize: '1.5rem',
            borderTopLeftRadius: '16px',
            borderTopRightRadius: '16px',
          }}
        />
        <CardContent sx={{ flexGrow: 1, overflowY: 'auto', p: 4 }}>
          <Stack spacing={3}>
            <TextField
              label="Имя"
              name="name"
              value={employee.name}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Фамилия"
              name="surname"
              value={employee.surname}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Роль"
              name="role"
              value={employee.role}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Табельный номер"
              name="tabel_id"
              value={employee.tabel_id}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Patrol ID"
              name="patrol_id"
              value={employee.patrol_id}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Office ID"
              name="office_id"
              value={employee.office_id}
              onChange={handleInputChange}
              fullWidth
              variant="outlined"
            />
          </Stack>
        </CardContent>
        <Box
          sx={{
            p: 3,
            borderTop: '1px solid #e0e0e0',
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
            borderBottomLeftRadius: '16px',
            borderBottomRightRadius: '16px',
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={isSaving}
            sx={{
              fontSize: '1rem',
              fontWeight: 'bold',
              borderRadius: '8px',
              minWidth: '200px',
              py: 1.5,
            }}
          >
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
