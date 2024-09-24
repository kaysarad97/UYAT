'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Box, Button, Card, CardActions, CardContent, Divider, FormControl, FormHelperText, InputLabel, OutlinedInput, Stack, Typography, Grid } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { paths } from '@/paths';
import { toast } from '@/components/core/toaster';

// Define ObjectId validation regex
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

// Define the validation schema
const schema = zod.object({
  name: zod.string().min(1, 'Имя обязательно').max(255),
  surname: zod.string().min(1, 'Фамилия обязательна').max(255),
  role: zod.string().min(1, 'Роль обязательна').max(255),
  tabel_id: zod.string().min(1, 'Табельный номер обязателен').max(255),
  patrol_id: zod.string().min(1, 'Patrol ID обязателен').max(255)
    .regex(objectIdRegex, 'Patrol ID должен быть действительным ObjectId'),
  office_id: zod.string().min(1, 'Office ID обязателен').max(255)
    .regex(objectIdRegex, 'Office ID должен быть действительным ObjectId'),
});

const defaultValues = {
  name: '',
  surname: '',
  role: '',
  tabel_id: '',
  patrol_id: '',
  office_id: '',
};

export function CustomerCreateForm() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(schema),
  });

  // Form submit handler
  // Form submit handler
const onSubmit = async (formData) => {
  try {
    const queryParams = new URLSearchParams({
      name: formData.name,
      surname: formData.surname,
      role: formData.role,
      tabel_id: formData.tabel_id,
      patrol_id: formData.patrol_id,
      office_id: formData.office_id,
    }).toString();

    // Формируем URL с параметрами
    const apiUrl = `http://37.99.82.96:8000/api/v1/employee/?${queryParams}`;

    // Отправляем POST-запрос без body, используя URL с параметрами
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      throw new Error(`Ошибка API: ${errorText}`);
    }

    const responseData = await response.json();
    console.log('Full API Response:', responseData);

    if (!responseData.name || !responseData.surname) {
      throw new Error('Ответ сервера содержит некорректные данные.');
    }

    // Успешное создание сотрудника
    toast.success('Сотрудник успешно создан');
    router.push(paths.dashboard.customers.list);
  } catch (err) {
    console.error('Ошибка при создании сотрудника:', err);
    toast.error(`Ошибка: ${err.message || 'Не удалось создать сотрудника'}`);
  }
};


  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card sx={{ maxWidth: '900px', mx: 'auto', p: 3, boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', borderRadius: '12px' }}>
        <CardContent>
          <Typography variant="h5" gutterBottom sx={{ mb: 2, fontWeight: 600 }}>
            Создание сотрудника
          </Typography>
          <Stack divider={<Divider />} spacing={4}>
            <Typography variant="h6">Информация о сотруднике</Typography>
            <Grid container spacing={3}>
              <Grid md={6} xs={12}>
                <Controller
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.name)} fullWidth>
                      <InputLabel required>Имя</InputLabel>
                      <OutlinedInput {...field} />
                      {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid md={6} xs={12}>
                <Controller
                  control={control}
                  name="surname"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.surname)} fullWidth>
                      <InputLabel required>Фамилия</InputLabel>
                      <OutlinedInput {...field} />
                      {errors.surname ? <FormHelperText>{errors.surname.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid md={6} xs={12}>
                <Controller
                  control={control}
                  name="role"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.role)} fullWidth>
                      <InputLabel required>Роль</InputLabel>
                      <OutlinedInput {...field} />
                      {errors.role ? <FormHelperText>{errors.role.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid md={6} xs={12}>
                <Controller
                  control={control}
                  name="tabel_id"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.tabel_id)} fullWidth>
                      <InputLabel required>Табельный номер</InputLabel>
                      <OutlinedInput {...field} />
                      {errors.tabel_id ? <FormHelperText>{errors.tabel_id.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid md={6} xs={12}>
                <Controller
                  control={control}
                  name="patrol_id"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.patrol_id)} fullWidth>
                      <InputLabel required>Patrol ID</InputLabel>
                      <OutlinedInput {...field} />
                      {errors.patrol_id ? <FormHelperText>{errors.patrol_id.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid md={6} xs={12}>
                <Controller
                  control={control}
                  name="office_id"
                  render={({ field }) => (
                    <FormControl error={Boolean(errors.office_id)} fullWidth>
                      <InputLabel required>Office ID</InputLabel>
                      <OutlinedInput {...field} />
                      {errors.office_id ? <FormHelperText>{errors.office_id.message}</FormHelperText> : null}
                    </FormControl>
                  )}
                />
              </Grid>
            </Grid>
          </Stack>
        </CardContent>
        <CardActions sx={{ justifyContent: 'flex-end', mt: 2 }}>
          <Button
            color="secondary"
            component={Link}
            href={paths.dashboard.customers.list}
            sx={{ mr: 2, fontWeight: 'bold', textTransform: 'none' }}
          >
            Отмена
          </Button>
          <Button type="submit" variant="contained" sx={{ fontWeight: 'bold', textTransform: 'none' }}>
            Создать сотрудника
          </Button>
        </CardActions>
      </Card>
    </form>
  );
}
