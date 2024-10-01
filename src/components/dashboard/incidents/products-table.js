
// 'use client';

// import React, { useState } from 'react';
// import Box from '@mui/material/Box';
// import Chip from '@mui/material/Chip';
// import IconButton from '@mui/material/IconButton';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import CircularProgress from '@mui/material/CircularProgress'; 
// import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
// import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
// import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
// import { Image as ImageIcon } from '@phosphor-icons/react/dist/ssr/Image';
// import { DataTable } from '@/components/core/data-table';
// import { ProductModal } from './product-modal';
// import { fetchApiWithAuth } from '@/lib/auth/custom/client'; // Импорт функции для запросов с авторизацией

// const columns = [
//   {
//     formatter: (row) => (
//       <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
//         {row.media?.[0]?.content ? (
//           <Box
//             sx={{
//               alignItems: 'center',
//               bgcolor: 'var(--mui-palette-background-level2)',
//               backgroundImage: `url(data:${row.media[0].content_type};base64,${row.media[0].content})`,
//               backgroundPosition: 'center',
//               backgroundSize: 'cover',
//               borderRadius: 1,
//               display: 'flex',
//               height: '80px',
//               justifyContent: 'center',
//               overflow: 'hidden',
//               width: '80px',
//             }}
//           />
//         ) : (
//           <Box
//             sx={{
//               alignItems: 'center',
//               bgcolor: 'var(--mui-palette-background-level2)',
//               borderRadius: 1,
//               display: 'flex',
//               height: '80px',
//               justifyContent: 'center',
//               width: '80px',
//             }}
//           >
//             <ImageIcon fontSize="var(--icon-fontSize-lg)" />
//           </Box>
//         )}
//         <div>
//           <Typography color="text.primary" variant="subtitle2">
//             {row.title}
//           </Typography>
//           <Typography color="text.secondary" variant="body2">
//             {row.tags}
//           </Typography>
//         </div>
//       </Stack>
//     ),
//     name: 'Наименование',
//     width: '300px',
//   },
//   {
//     field: 'achievement_sum',
//     name: 'Предполагаемое вознаграждение',
//     width: '150px',
//   },
//   {
//     formatter: (row) => (row.set_employee ? row.set_employee : 'Not Assigned'),
//     name: 'Назначенный сотрудник',
//     width: '150px',
//   },
//   {
//     formatter: (row) => {
//       const status = row.set_employee ? 'Отправлено' : 'В ожидании'; 'Завершено' 
//       const mapping = {
//         'Отправлено': {
//           label: 'Отправлено',
//           icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" />,
//         },
//         'В ожидании': {
//           label: 'В ожидании',
//           icon: <ClockIcon color="var(--mui-palette-secondary-main)" />,
//         },
//         'Завершено': {
//           label: 'Завершено',
//           icon: <ClockIcon color="var(--mui-palette-secondary-main)" />,
//         },
//       };
//       const { label, icon } = mapping[status] ?? { label: 'Unknown', icon: null };
//       return <Chip icon={icon} label={label} size="small" variant="outlined" />;
//     },
//     name: 'Статус',
//     width: '150px',
//   },
//   {
//     formatter: (row, onClick) => (
//       <IconButton onClick={() => onClick(row.id)}>
//         <EyeIcon />
//       </IconButton>
//     ),
//     name: 'Actions',
//     hideName: true,
//     width: '100px',
//     align: 'right',
//   },
// ];

// export function ProductsTable({ rows = [] }) {
//   const [selectedProduct, setSelectedProduct] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleRowClick = async (productId) => {
//     setLoading(true);
//     try {
//       const productData = await fetchApiWithAuth(`http://37.99.82.96:8000/api/v1/incident-web/get/${productId}`, {
//         method: 'GET',
//       });
//       setSelectedProduct(productData);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCloseModal = () => {
//     setSelectedProduct(null);
//   };

//   return (
//     <React.Fragment>
//       <DataTable
//         columns={columns.map((col) => ({
//           ...col,
//           formatter: col.formatter ? (row) => col.formatter(row, handleRowClick) : undefined,
//         }))}
//         rows={rows}
//       />
//       {!rows.length ? (
//         <Box sx={{ p: 3 }}>
//           <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
//             No incidents found
//           </Typography>
//         </Box>
//       ) : null}
//       {selectedProduct && (
//         <ProductModal open={!!selectedProduct} product={selectedProduct} onClose={handleCloseModal} />
//       )}
//       {loading && <CircularProgress />}
//       {error && <Typography color="error">{error}</Typography>}
//     </React.Fragment>
//   );
// }
'use client';

import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress'; 
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { Image as ImageIcon } from '@phosphor-icons/react/dist/ssr/Image';
import { DataTable } from '@/components/core/data-table';
import { ProductModal } from './product-modal';
import { fetchApiWithAuth } from '@/lib/auth/custom/client'; 
import TokenService from '@/lib/auth/custom/refresh';

const columns = [
  {
    formatter: (row) => (
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        {row.media?.[0]?.content ? (
          <Box
            sx={{
              alignItems: 'center',
              bgcolor: 'var(--mui-palette-background-level2)',
              backgroundImage: `url(data:${row.media[0].content_type};base64,${row.media[0].content})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
              borderRadius: 1,
              display: 'flex',
              height: '80px',
              justifyContent: 'center',
              overflow: 'hidden',
              width: '80px',
            }}
          />
        ) : (
          <Box
            sx={{
              alignItems: 'center',
              bgcolor: 'var(--mui-palette-background-level2)',
              borderRadius: 1,
              display: 'flex',
              height: '80px',
              justifyContent: 'center',
              width: '80px',
            }}
          >
            <ImageIcon fontSize="var(--icon-fontSize-lg)" />
          </Box>
        )}
        <div>
          <Typography color="text.primary" variant="subtitle2">
            {row.title}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {/* Проверяем тип данных перед выводом */}
            {Array.isArray(row.tags) ? row.tags.join(', ') : row.tags || 'Без тегов'}
          </Typography>
        </div>
      </Stack>
    ),
    name: 'Наименование',
    width: '300px',
  },
  {
    field: 'achievement_sum',
    name: 'Предполагаемое вознаграждение',
    width: '150px',
  },
  // {
  //   formatter: (row) => {
  //     if (row.set_employee_data) {
  //       const { name, surname, role } = row.set_employee_data;
  //       return `${name} ${surname} (${role})`;
  //     }
  //     return 'Not Assigned';
  //   },
  //   name: 'Назначенный сотрудник',
  // },
  {
    formatter: (row) => {
      const createdAt = new Date(row.created_at).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return createdAt;
    },
    name: 'Дата создание',
  },
  {
    formatter: (row) => {
      const status = row.status || 'Unknown';
      const mapping = {
        'Отправлено': {
          label: 'Отправлено',
          icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" />,
        },
        'В работе': {
          label: 'В работе',
          icon: <ClockIcon color="var(--mui-palette-secondary-main)" />,
        },
        'Завершено': {
          label: 'Завершено',
          icon: <CheckCircleIcon color="var(--mui-palette-secondary-main)" />,
        },
      };
      const { label, icon } = mapping[status] ?? { label: 'Unknown', icon: null };
      return <Chip icon={icon} label={label} size="small" variant="outlined" />;
    },
    name: 'Статус',
    width: '150px',
  },
  {
    formatter: (row, onClick) => (
      <IconButton onClick={() => onClick(row.id)}>
        <EyeIcon />
      </IconButton>
    ),
    name: 'Actions',
    hideName: true,
    width: '100px',
    align: 'right',
  },
];

export function ProductsTable({ filters = {} }) {
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      let url = 'http://37.99.82.96:8000/api/v1/incident-web/history?';
      const queryParams = new URLSearchParams();

      // Применяем фильтры
      if (filters.status) {
        queryParams.append('statuses', filters.status);
      }

      if (filters.date_filter) {
        queryParams.append('date_filter', filters.date_filter);
      }

      if (filters.tag) {
        queryParams.append('tags', filters.tag);  // Фильтр по тегам
      }
      console.log("Query Params:", queryParams.toString()); // Проверяем перед запросом
      url += queryParams.toString();

      const token = TokenService.getAccessToken();

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Ошибка при загрузке данных: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log("Filters:", filters);
      console.log("Tags in fetched incidents:", data.map(incident => incident.tags));

       // Применяем фильтр на клиенте, если выбран тег
    const filteredIncidents = data.filter(incident => {
      // Если фильтр по тегам не установлен, возвращаем все инциденты
      if (!filters.tag) return true;

      // Сравниваем строковое поле `tags` с выбранным тегом
      return incident.tags === filters.tag;
    });

    setIncidents(filteredIncidents); 

      setIncidents(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents(); // Обновляем данные при изменении фильтров
  }, [filters]);

  const handleRowClick = async (productId) => {
    setLoading(true);
    try {
      const productData = await fetchApiWithAuth(`http://37.99.82.96:8000/api/v1/incident-web/get/${productId}`, {
        method: 'GET',
      });

      const formattedCreatedAt = new Date(productData.created_at).toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      setSelectedProduct({ ...productData, formattedCreatedAt });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <React.Fragment>
      <DataTable
        columns={columns.map((col) => ({
          ...col,
          formatter: col.formatter ? (row) => col.formatter(row, handleRowClick) : undefined,
        }))}
        rows={incidents}
      />

      {!incidents.length ? (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
            Нет инцидентов
          </Typography>
        </Box>
      ) : null}

      {selectedProduct && (
        <ProductModal open={!!selectedProduct} product={selectedProduct} onClose={handleCloseModal} />
      )}
    </React.Fragment>
  );
}
