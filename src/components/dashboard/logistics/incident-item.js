// import React, { useState, useEffect } from 'react';
// import Collapse from '@mui/material/Collapse';
// import TableRow from '@mui/material/TableRow';
// import TableCell from '@mui/material/TableCell';
// import Box from '@mui/material/Box';
// import Button from '@mui/material/Button';
// import Card from '@mui/material/Card';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import { styled } from '@mui/system';
// import dayjs from 'dayjs';
// import { fetchApiWithAuth } from '@/lib/auth/custom/client'; // Импорт функции для запросов с авторизацией

// // Styled IconButton for a modern expand/collapse icon
// const ExpandMoreButton = styled((props) => {
//   const { expand, ...other } = props;
//   return <IconButton {...other} />;
// })(({ theme, expand }) => ({
//   transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
//   marginLeft: 'auto',
//   transition: theme.transitions.create('transform', {
//     duration: theme.transitions.duration.shortest,
//   }),
// }));

// export function IncidentItem({ incident, onSelect, onDeselect, selected }) {
//   const handleToggle = React.useCallback(() => {
//     if (!selected) {
//       onSelect?.(incident.id);
//     } else {
//       onDeselect?.();
//     }
//   }, [onDeselect, onSelect, selected, incident]);

//   const [authorData, setAuthorData] = useState(null);
//   const [showMedia, setShowMedia] = useState(false);

//   const toggleMedia = () => setShowMedia((prev) => !prev);

//   useEffect(() => {
//     if (incident?.author_id) {
//       fetchApiWithAuth(`http://37.99.82.96:8000/api/v1/users/${incident.author_id}`, {
//         method: 'POST', // Метод POST
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       })
//         .then(data => setAuthorData(data)) // Сохраняем данные автора
//         .catch(error => console.error('Ошибка при загрузке данных автора:', error));
//     }
//   }, [incident?.author_id]);

//   const mediaContent = incident.media?.length ? incident.media[0].content : '';

//   return (
//     <>
//       <TableRow hover onClick={handleToggle} sx={{ cursor: 'pointer', transition: 'all 0.3s', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
//         <TableCell sx={{ padding: '16px 24px', fontWeight: 500 }}>{incident.title || 'No title available'}</TableCell>
//         <TableCell sx={{ padding: '16px 24px' }}>{incident.tags || 'Unknown type'}</TableCell>
//         <TableCell sx={{ padding: '16px 24px' }}>
//           {authorData ? `${authorData.name} ${authorData.surname}` : 'Джони Деп'}
//         </TableCell>
//         <TableCell sx={{ padding: '16px 24px' }}>{incident.created_at ? dayjs(incident.created_at).format('MMM D, hh:mm A') : 'Unknown date'}</TableCell>
//         <TableCell sx={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//           {incident.status || 'Unknown status'}
//           <ExpandMoreButton expand={selected} onClick={handleToggle}>
//             {/* You can replace this button with anything you prefer, or remove it */}
//           </ExpandMoreButton>
//         </TableCell>
//       </TableRow>

//       {/* Collapse content for showing additional details */}
//       <TableRow>
//         <TableCell colSpan={6} style={{ padding: 0 }}>
//           <Collapse in={selected} timeout="auto" unmountOnExit>
//             <Card sx={{ margin: 2, padding: 3, boxShadow: 'none', border: '1px solid rgba(0, 0, 0, 0.12)' }}>
//               <Box sx={{ p: 2 }}>
//                 <Typography variant="h6" gutterBottom>Статус: {incident.status || 'Unknown status'}</Typography>
//                 <Typography variant="body2" gutterBottom>Предполагаемое вознаграждение: {incident.achievement_sum || 'No data'}</Typography>

//                 {/* Toggle button to show or hide media */}
//                 {mediaContent && (
//                   <Button variant="contained" onClick={toggleMedia} sx={{ mt: 2, textTransform: 'none' }}>
//                     {showMedia ? 'Hide Media' : 'Show Media'}
//                   </Button>
//                 )}

//                 {/* Display base64 media if it's available and showMedia is true */}
//                 {showMedia && mediaContent && (
//                   <Box sx={{ mt: 2 }}>
//                     <img
//                       src={`data:image/jpeg;base64,${mediaContent}`}
//                       alt={incident.title}
//                       style={{ maxWidth: '100%', maxHeight: '300px', height: 'auto', objectFit: 'contain', borderRadius: '8px' }}
//                     />
//                   </Box>
//                 )}
//               </Box>
//             </Card>
//           </Collapse>
//         </TableCell>
//       </TableRow>
//     </>
//   );
// }
import React, { useState, useEffect } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton'; // Добавляем этот импорт
import { styled } from '@mui/system';
import dayjs from 'dayjs';
import { fetchApiWithAuth } from '@/lib/auth/custom/client'; // Импорт функции для запросов с авторизацией

// Styled IconButton for a modern expand/collapse icon
const ExpandMoreButton = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export function IncidentItem({ incident, onSelect, onDeselect, selected }) {
  const handleToggle = React.useCallback(() => {
    if (!selected) {
      onSelect?.(incident.id);
    } else {
      onDeselect?.();
    }
  }, [onDeselect, onSelect, selected, incident]);

  const [authorData, setAuthorData] = useState(null);

  useEffect(() => {
    if (incident?.author_id) {
      fetchApiWithAuth(`http://37.99.82.96:8000/api/v1/users/${incident.author_id}`, {
        method: 'POST', // Метод POST
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(data => setAuthorData(data)) // Сохраняем данные автора
        .catch(error => console.error('Ошибка при загрузке данных автора:', error));
    }
  }, [incident?.author_id]);

  return (
    <TableRow hover onClick={handleToggle} sx={{ cursor: 'pointer', transition: 'all 0.3s', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}>
      <TableCell sx={{ padding: '16px 24px', fontWeight: 500 }}>{incident.title || 'No title available'}</TableCell>
      <TableCell sx={{ padding: '16px 24px' }}>{incident.tags || 'Unknown type'}</TableCell>
      <TableCell sx={{ padding: '16px 24px' }}>
        {authorData ? `${authorData.name} ${authorData.surname}` : 'Джони Деп'}
      </TableCell>
      <TableCell sx={{ padding: '16px 24px' }}>{incident.created_at ? dayjs(incident.created_at).format('MMM D, hh:mm A') : 'Unknown date'}</TableCell>
      <TableCell sx={{ padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {incident.status || 'Unknown status'}
        <ExpandMoreButton expand={selected} onClick={handleToggle}>
          {/* Можно заменить этот элемент другим или полностью удалить */}
        </ExpandMoreButton>
      </TableCell>
    </TableRow>
  );
}
