// 'use client';

// import React, { useState } from 'react';
// import RouterLink from 'next/link';
// import Box from '@mui/material/Box';
// import Chip from '@mui/material/Chip';
// import IconButton from '@mui/material/IconButton';
// import Link from '@mui/material/Link';
// import Stack from '@mui/material/Stack';
// import Typography from '@mui/material/Typography';
// import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
// import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
// import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
// import { Image as ImageIcon } from '@phosphor-icons/react/dist/ssr/Image';
// import { paths } from '@/paths';
// import { DataTable } from '@/components/core/data-table';
// import { ProductModal } from './product-modal'; // Import the ProductModal component

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
//             onError={(e) => {
//               e.target.style.backgroundImage = 'none';
//               e.target.innerHTML = '<ImageIcon fontSize="var(--icon-fontSize-lg)" />';
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
//           <Link
//             color="text.primary"
//             component={RouterLink}
//             href={paths.dashboard.incidents.preview(row.id)}
//             sx={{ whiteSpace: 'nowrap' }}
//             variant="subtitle2"
//           >
//             {row.title}
//           </Link>
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
//     name: 'Achievement Sum',
//     width: '150px',
//   },
//   {
//     formatter: (row) => (row.set_employee ? row.set_employee : 'Not Assigned'),
//     name: 'Назначенный сотрудник',
//     width: '150px',
//   },
//   {
//     formatter: (row) =>
//       row.geo?.timestamp ? new Date(row.geo.timestamp).toLocaleDateString('ru-RU') : 'No Date Available',
//     name: 'Дата создания',
//     width: '150px',
//   },
//   {
//     formatter: (row) => {
//       const mapping = {
//         'Отправлено': {
//           label: 'Отправлено',
//           icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" />,
//         },
//         'В ожиданий': {
//           label: 'В ожиданий',
//           icon: <ClockIcon color="var(--mui-palette-secondary-main)" />,
//         },
//       };
//       const { label, icon } = mapping[row.status] ?? { label: 'Unknown', icon: null };

//       return <Chip icon={icon} label={label} size="small" variant="outlined" />;
//     },
//     name: 'Статус',
//     width: '150px',
//   },
//   {
//     formatter: (row, onClick) => (
//       <IconButton onClick={() => onClick(row)}>
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

//   const handleRowClick = (product) => {
//     setSelectedProduct(product);
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
//     </React.Fragment>
//   );
// }
'use client';

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { CheckCircle as CheckCircleIcon } from '@phosphor-icons/react/dist/ssr/CheckCircle';
import { Clock as ClockIcon } from '@phosphor-icons/react/dist/ssr/Clock';
import { Eye as EyeIcon } from '@phosphor-icons/react/dist/ssr/Eye';
import { Image as ImageIcon } from '@phosphor-icons/react/dist/ssr/Image';
import { DataTable } from '@/components/core/data-table';
import { ProductModal } from './product-modal'; // Импортируем компонент ProductModal

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
            onError={(e) => {
              e.target.style.backgroundImage = 'none';
              e.target.innerHTML = '<ImageIcon fontSize="var(--icon-fontSize-lg)" />';
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
            {row.tags}
          </Typography>
        </div>
      </Stack>
    ),
    name: 'Наименование',
    width: '300px',
  },
  
  {
    field: 'achievement_sum',
    name: 'Предпологаемое вознаграждения',
    width: '150px',
  },
  {
    formatter: (row) => (row.set_employee ? row.set_employee : 'Not Assigned'),
    name: 'Назначенный сотрудник',
    width: '150px',
  },
  
  {
    formatter: (row) => {
      const status = row.set_employee ? 'Отправлено' : 'В ожиданий'; // Проверка на наличие прикрепленного сотрудника
    
      const mapping = {
        'Отправлено': {
          label: 'Отправлено',
          icon: <CheckCircleIcon color="var(--mui-palette-success-main)" weight="fill" />,
        },
        'В ожиданий': {
          label: 'В ожиданий',
          icon: <ClockIcon color="var(--mui-palette-secondary-main)" />,
        },
      };
  
      const { label, icon } = mapping[status] ?? { label: 'Unknown', icon: null };
  
      return <Chip icon={icon} label={label} size="small" variant="outlined" />;
    },
    name: 'Статус',
    width: '150px',
  }
  
  ,
  {
    formatter: (row, onClick) => (
      <IconButton onClick={() => onClick(row)}>
        <EyeIcon />
      </IconButton>
    ),
    name: 'Actions',
    hideName: true,
    width: '100px',
    align: 'right',
  },
];

export function ProductsTable({ rows = [] }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleRowClick = (product) => {
    setSelectedProduct(product);
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <React.Fragment>
      <DataTable
        columns={columns.map((col) => ({
          ...col,
          formatter: col.formatter ? (row) => col.formatter(row, handleRowClick) : undefined,
        }))}
        rows={rows}
      />
      {!rows.length ? (
        <Box sx={{ p: 3 }}>
          <Typography color="text.secondary" sx={{ textAlign: 'center' }} variant="body2">
            No incidents found
          </Typography>
        </Box>
      ) : null}
      {selectedProduct && (
        <ProductModal open={!!selectedProduct} product={selectedProduct} onClose={handleCloseModal} />
      )}
    </React.Fragment>
  );
}
