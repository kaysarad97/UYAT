// import React, { useState } from 'react';
// import { Box, Card, Stack, Typography, IconButton, Dialog, DialogContent, Checkbox, Button } from '@mui/material';
// import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
// import { Image as ImageIcon } from '@phosphor-icons/react/dist/ssr/Image';

// export function ProductModal({ open, product, onClose }) {
//   // Состояние для открытия и закрытия модального окна с аналитикой
//   const [analyticsOpen, setAnalyticsOpen] = useState(false);

//   // Получаем Base64 контент медиа и тип
//   const mediaContent = product?.media?.[0]?.content || null;
//   const mediaFilename = product?.media?.[0]?.filename || null;
//   const mediaUrl = product?.media_url?.[0] || null;

//   const isVideo = mediaFilename && mediaFilename.endsWith('.mp4'); // Определяем тип медиа по расширению файла

//   const handleAnalyticsOpen = () => {
//     setAnalyticsOpen(true);
//   };

//   const handleAnalyticsClose = () => {
//     setAnalyticsOpen(false);
//   };

//   return (
//     <>
//       <Dialog
//         maxWidth="lg"
//         onClose={onClose}
//         open={open}
//         sx={{
//           '& .MuiDialog-container': { justifyContent: 'center' },
//           '& .MuiDialog-paper': { height: '90%', width: '90%', display: 'flex', flexDirection: 'row' },
//         }}
//       >
//         <DialogContent sx={{ display: 'flex', flexDirection: 'row', gap: 2, padding: 0 }}>
//           {/* Левая часть: Изображение или Видео инцидента */}
//           <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 2 }}>
//             {isVideo ? (
//               // Если это видео, используем URL или base64 для отображения
//               <Box
//                 component="video"
//                 controls
//                 preload="none"
//                 src={mediaUrl ? `http://37.99.82.96:8000${mediaUrl}` : `data:video/mp4;base64,${mediaContent}`} // Видео из URL или Base64
//                 alt="Видео инцидента"
//                 onError={(e) => {
//                   console.error('Ошибка загрузки видео:', e.target.src); // Логирование ошибки загрузки видео
//                 }}
//                 sx={{
//                   width: '100%',
//                   height: 'auto',
//                   maxHeight: '400px',
//                   objectFit: 'cover',
//                   borderRadius: 2,
//                 }}
//               />
//             ) : mediaContent ? (
//               // Если это изображение, отображаем его в формате Base64
//               <Box
//                 component="img"
//                 src={`data:image/jpeg;base64,${mediaContent}`}
//                 alt="Фото инцидента"
//                 onError={(e) => {
//                   console.error('Ошибка загрузки изображения:', e.target.src); // Логирование ошибки загрузки изображения
//                   e.target.src = '/path/to/fallback-image.png'; // Резервное изображение в случае ошибки
//                 }}
//                 sx={{
//                   width: '100%',
//                   height: 'auto',
//                   maxHeight: '400px',
//                   objectFit: 'cover',
//                   borderRadius: 2,
//                 }}
//               />
//             ) : (
//               // Резервный вариант, если медиа недоступно
//               <Box
//                 sx={{
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   width: '100%',
//                   height: '300px',
//                   bgcolor: 'var(--mui-palette-background-level2)',
//                   borderRadius: 2,
//                 }}
//               >
//                 <ImageIcon fontSize="large" />
//               </Box>
//             )}
//           </Box>

//           {/* Правая часть: Информация об инциденте */}
//           <Box sx={{ flex: 1, padding: 2 }}>
//             <Stack spacing={2}>
//               {/* Название и теги инцидента */}
//               <Card variant="outlined" sx={{ padding: 2 }}>
//                 <Typography variant="h6">{product?.title || 'Нет названия'}</Typography>
//                 <Typography variant="body2" color="text.secondary">
//                   {product?.tags || 'Нет тегов'}
//                 </Typography>
//               </Card>

//               {/* Результаты аналитики */}
//               <Card variant="outlined" sx={{ padding: 2 }}>
//                 <Typography variant="body2">Статус аналитики:</Typography>
//                 <Stack direction="row" alignItems="center" spacing={2}>
//                   <Checkbox checked={product?.analytics_results !== null} disabled />
//                   <Typography variant="body2">
//                     {product?.analytics_results !== null ? 'Обработано' : 'В процессе'}
//                   </Typography>

//                   {/* Кнопка для открытия данных аналитики, если статус "Обработано" */}
//                   {product?.analytics_results !== null && (
//                     <Button variant="outlined" onClick={handleAnalyticsOpen}>
//                       Показать данные аналитики
//                     </Button>
//                   )}
//                 </Stack>
//               </Card>

//               {/* Награда за инцидент и назначенный сотрудник */}
//               <Card variant="outlined" sx={{ padding: 2 }}>
//                 <Typography variant="body2">Сумма вознаграждения:</Typography>
//                 <Typography variant="subtitle1">₸ {product?.achievement_sum || '0'}</Typography>

//                 <Typography variant="body2" sx={{ mt: 2 }}>
//                   Назначенный сотрудник:
//                 </Typography>
//                 <Typography variant="subtitle1">
//                   {product?.set_employee || 'Не назначено'}
//                 </Typography>
//               </Card>

            
//             </Stack>
//           </Box>

//           {/* Кнопка закрытия */}
//           <IconButton
//             onClick={onClose}
//             sx={{ position: 'absolute', top: 8, right: 8, color: 'var(--mui-palette-text-secondary)' }}
//           >
//             <XIcon />
//           </IconButton>
//         </DialogContent>
//       </Dialog>

//       {/* Модальное окно с данными аналитики */}
//       <Dialog open={analyticsOpen} onClose={handleAnalyticsClose} maxWidth="md">
//         <DialogContent>
//           <Typography variant="h6">Данные аналитики</Typography>
//           <pre>{JSON.stringify(product?.analytics_results, null, 2)}</pre> {/* Отображаем данные аналитики в формате JSON */}
//           <Button onClick={handleAnalyticsClose}>Закрыть</Button>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }
import React, { useState } from 'react';
import { Box, Card, Stack, Typography, IconButton, Dialog, DialogContent, Checkbox, Button } from '@mui/material';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { Image as ImageIcon } from '@phosphor-icons/react/dist/ssr/Image';

export function ProductModal({ open, product, onClose }) {
  // Состояние для открытия и закрытия модального окна с аналитикой
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  // Получаем Base64 контент медиа, тип и URL
  const mediaContent = product?.media?.[0]?.content || null;
  const mediaFilename = product?.media?.[0]?.filename || null;
  const mediaUrl = product?.media_url?.[0] || null; // Проверяем, есть ли URL

  const isVideo = mediaFilename && mediaFilename.endsWith('.mp4'); // Определяем тип медиа по расширению файла

  const handleAnalyticsOpen = () => {
    setAnalyticsOpen(true);
  };

  const handleAnalyticsClose = () => {
    setAnalyticsOpen(false);
  };

  return (
    <>
      <Dialog
        maxWidth="lg"
        onClose={onClose}
        open={open}
        sx={{
          '& .MuiDialog-container': { justifyContent: 'center' },
          '& .MuiDialog-paper': { height: '90%', width: '90%', display: 'flex', flexDirection: 'row' },
        }}
      >
        <DialogContent sx={{ display: 'flex', flexDirection: 'row', gap: 2, padding: 0 }}>
          {/* Левая часть: Изображение или Видео инцидента */}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 2 }}>
            {isVideo ? (
              // Если это видео, используем URL или base64 для отображения
              <Box
                component="video"
                controls
                preload="none"
                src={mediaUrl ? `http://37.99.82.96:8000${mediaUrl}` : `data:video/mp4;base64,${mediaContent}`} // Видео из URL или Base64
                alt="Видео инцидента"
                onError={(e) => {
                  console.error('Ошибка загрузки видео:', e.target.src); // Логирование ошибки загрузки видео
                }}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
              />
            ) : mediaUrl ? (
              // Если это изображение по URL
              <Box
                component="img"
                src={`http://37.99.82.96:8000${mediaUrl}`} // Изображение по URL
                alt="Фото инцидента"
                onError={(e) => {
                  console.error('Ошибка загрузки изображения:', e.target.src); // Логирование ошибки загрузки изображения
                  e.target.src = '/path/to/fallback-image.png'; // Резервное изображение в случае ошибки
                }}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
              />
            ) : mediaContent ? (
              // Если это изображение в формате Base64
              <Box
                component="img"
                src={`data:image/jpeg;base64,${mediaContent}`}
                alt="Фото инцидента"
                onError={(e) => {
                  console.error('Ошибка загрузки изображения:', e.target.src); // Логирование ошибки загрузки изображения
                  e.target.src = '/path/to/fallback-image.png'; // Резервное изображение в случае ошибки
                }}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
              />
            ) : (
              // Резервный вариант, если медиа недоступно
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  height: '300px',
                  bgcolor: 'var(--mui-palette-background-level2)',
                  borderRadius: 2,
                }}
              >
                <ImageIcon fontSize="large" />
              </Box>
            )}
          </Box>

          {/* Правая часть: Информация об инциденте */}
          <Box sx={{ flex: 1, padding: 2 }}>
            <Stack spacing={2}>
              {/* Название и теги инцидента */}
              <Card variant="outlined" sx={{ padding: 2 }}>
                <Typography variant="h6">{product?.title || 'Нет названия'}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {product?.tags || 'Нет тегов'}
                </Typography>
              </Card>

              {/* Результаты аналитики */}
              <Card variant="outlined" sx={{ padding: 2 }}>
                <Typography variant="body2">Статус аналитики:</Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Checkbox checked={product?.analytics_results !== null} disabled />
                  <Typography variant="body2">
                    {product?.analytics_results !== null ? 'Обработано' : 'В процессе'}
                  </Typography>

                  {/* Кнопка для открытия данных аналитики, если статус "Обработано" */}
                  {product?.analytics_results !== null && (
                    <Button variant="outlined" onClick={handleAnalyticsOpen}>
                      Показать данные аналитики
                    </Button>
                  )}
                </Stack>
              </Card>

              {/* Награда за инцидент и назначенный сотрудник */}
              <Card variant="outlined" sx={{ padding: 2 }}>
                <Typography variant="body2">Сумма вознаграждения:</Typography>
                <Typography variant="subtitle1">₸ {product?.achievement_sum || '0'}</Typography>

                <Typography variant="body2" sx={{ mt: 2 }}>
                  Назначенный сотрудник:
                </Typography>
                <Typography variant="subtitle1">
                  {product?.set_employee || 'Не назначено'}
                </Typography>
              </Card>

            
            </Stack>
          </Box>

          {/* Кнопка закрытия */}
          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', top: 8, right: 8, color: 'var(--mui-palette-text-secondary)' }}
          >
            <XIcon />
          </IconButton>
        </DialogContent>
      </Dialog>

      {/* Модальное окно с данными аналитики */}
      <Dialog open={analyticsOpen} onClose={handleAnalyticsClose} maxWidth="md">
        <DialogContent>
          <Typography variant="h6">Данные аналитики</Typography>
          <pre>{JSON.stringify(product?.analytics_results, null, 2)}</pre> {/* Отображаем данные аналитики в формате JSON */}
          <Button onClick={handleAnalyticsClose}>Закрыть</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
