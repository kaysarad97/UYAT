
// import React, { useState } from 'react';
// import { Box, Card, Stack, Typography, IconButton, Dialog, DialogContent, Button } from '@mui/material';
// import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';

// export function ProductModal({ open, product, onClose }) {
//   const [analyticsOpen, setAnalyticsOpen] = useState(false);

//   // Получаем Base64 контент медиа
//   const mediaContent = product?.media?.[0]?.content || null; // Base64-строка медиа (видео или изображение)
//   const mediaFilename = product?.media?.[0]?.filename || null;
//   const mediaContentType = product?.media?.[0]?.content_type || null; // Тип контента (видео или изображение)

//   const isVideo = mediaContentType === 'video'; // Проверяем, является ли контент видео
//   const isImage = mediaContentType === 'image'; // Проверяем, является ли контент изображением

//   console.log(`Filename: ${mediaFilename}`);
//   console.log(`Length of Base64 media content: ${mediaContent?.length}`);

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
//           {/* Левая часть: Видео или изображение инцидента */}
//           <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 2 }}>
//             {isVideo && mediaContent ? (
//               <Box component="video" controls preload="none" sx={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover', borderRadius: 2 }}>
//               <source src={`data:video/mp4;base64,${mediaContent}`} type="video/mp4" />
//               Ваш браузер не поддерживает воспроизведение видео.
//             </Box>
            
              
//             ) : isImage && mediaContent ? (
//               <Box
//                 component="img"
//                 src={`data:image/jpeg;base64,${mediaContent}`} // Изображение из Base64
//                 alt="Изображение инцидента"
//                 onError={(e) => {
//                   console.error('Ошибка загрузки изображения:', e.target.src); // Логирование ошибки загрузки изображения
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
//               <Typography>Нет доступного медиа</Typography>
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

//               {/* Награда за инцидент и назначенный сотрудник */}
//               <Card variant="outlined" sx={{ padding: 2 }}>
//                 <Typography variant="body2">Сумма вознаграждения:</Typography>
//                 <Typography variant="subtitle1">₸ {product?.achievement_sum || '0'}</Typography>

//                 <Typography variant="body2" sx={{ mt: 2 }}>
//                   Назначенный сотрудник:
//                 </Typography>
//                 <Typography variant="subtitle1">
//                   {product?.set_employee_data
//                     ? `${product.set_employee_data.name} ${product.set_employee_data.surname} (${product.set_employee_data.role})`
//                     : 'Не назначено'}
//                 </Typography>
//               </Card>

//               {/* Результаты аналитики */}
//               <Card variant="outlined" sx={{ padding: 2 }}>
//                 <Typography variant="body2">Статус аналитики:</Typography>
//                 <Stack direction="row" alignItems="center" spacing={2}>
//                   <Typography variant="body2">
//                     {product?.analytics_results?.length ? 'Обработано' : 'В процессе'}
//                   </Typography>

//                   {product?.analytics_results?.length > 0 && (
//                     <Button variant="outlined" onClick={handleAnalyticsOpen}>
//                       Показать данные аналитики
//                     </Button>
//                   )}
//                 </Stack>
//               </Card>
//             </Stack>
//           </Box>

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
//           {/* Визуализируем данные аналитики */}
//           {/* Данные номера или ИИН */}
//     {product?.data && (
//       <Box sx={{ mb: 2 }}>
//         <Typography variant="subtitle1">Номер или ИИН: {result.data || 'Нет данных'}</Typography>
//       </Box>
//     )}
//           {product?.analytics_results?.map((result, index) => (
//             <Box key={index} sx={{ mb: 2 }}>
//                       <Typography variant="subtitle1">Номер или ИИН: {result.data || 'Нет данных'}</Typography>

//               {/* <Typography variant="subtitle1">Файл: {result.file_name || 'Нет данных'}</Typography> */}
//               {result.crop && result.crop.content && (
//                 <Box
//                   component="img"
//                   src={`data:image/jpeg;base64,${result.crop.content}`}
//                   alt="Кроп изображения"
//                   sx={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover', borderRadius: 2 }}
//                 />
//               )}
//             </Box>
//           ))}
//           <Button onClick={handleAnalyticsClose}>Закрыть</Button>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// }
import React, { useState, useEffect } from 'react';
import { Box, Card, Stack, Typography, IconButton, Dialog, DialogContent, Button, TextField, Avatar } from '@mui/material';
import { X as XIcon } from '@phosphor-icons/react/dist/ssr/X';
import { fetchApiWithAuth } from '@/lib/auth/custom/client'; 

export function ProductModal({ open, product, onClose }) {
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  const [authorData, setAuthorData] = useState(null); // Добавляем состояние для данных автора

  // Получаем Base64 контент медиа
  const mediaContent = product?.media?.[0]?.content || null;
  const mediaFilename = product?.media?.[0]?.filename || null;
  const mediaContentType = product?.media?.[0]?.content_type || null;

  const isVideo = mediaContentType === 'video';
  const isImage = mediaContentType === 'image';

  useEffect(() => {
    if (product?.author_id) {
      // Отправляем POST-запрос с токеном авторизации, используя fetchApiWithAuth
      fetchApiWithAuth(`http://37.99.82.96:8000/api/v1/users/${product.author_id}`, {
        method: 'POST', // Метод POST
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then(data => setAuthorData(data)) // Сохраняем данные автора
        .catch(error => console.error('Ошибка при загрузке данных автора:', error));
    }
  }, [product?.author_id]);

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
          '& .MuiDialog-paper': { height: '90%', width: '90%', display: 'flex', flexDirection: 'column' },
        }}
      >
        <DialogContent sx={{ display: 'flex', flexDirection: 'row', gap: 2, padding: 0, flex: 1 }}>
          {/* Левая часть: Медиа контент */}
          <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 2 }}>
            {isVideo && mediaContent ? (
              <Box component="video" controls preload="none" sx={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover', borderRadius: 2 }}>
                <source src={`data:video/mp4;base64,${mediaContent}`} type="video/mp4" />
                Ваш браузер не поддерживает воспроизведение видео.
              </Box>
            ) : isImage && mediaContent ? (
              <Box
                component="img"
                src={`data:image/jpeg;base64,${mediaContent}`}
                alt="Изображение инцидента"
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '400px',
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
              />
            ) : (
              <Typography>Нет доступного медиа</Typography>
            )}
          </Box>

          {/* Правая часть: Информация об инциденте */}
          <Box sx={{ flex: 1, padding: 2 }}>
            <Stack spacing={2}>

              {/* Используем crop для иконки и result.data для номера */}
              {product?.analytics_results?.map((result, index) => (
                <Card key={index} variant="outlined" sx={{ padding: 2 }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    {result.crop?.content ? (
                      <Box
                        component="img"
                        src={`data:image/jpeg;base64,${result.crop.content}`}
                        alt="Кроп изображения"
                        sx={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Avatar sx={{ width: 56, height: 56 }} />
                    )}
                    <Stack>
                      <Typography variant="h6">Данные аналитики</Typography>
                      <Typography variant="body2">Номер или ИИН: {result.data || 'Нет данных'}</Typography>
                    </Stack>
                  </Stack>
                </Card>
              ))}

              {/* Результаты аналитики */}
              <Card variant="outlined" sx={{ padding: 2 }}>
                <Typography variant="body2">Статус аналитики:</Typography>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Typography variant="body2">
                    {product?.analytics_results?.length ? 'Обработано' : 'В процессе'}
                  </Typography>

                  {product?.analytics_results?.length > 0 && (
                    <Button variant="outlined" onClick={handleAnalyticsOpen}>
                      Показать данные аналитики
                    </Button>
                  )}
                </Stack>
              </Card>
            </Stack>
          </Box>

          <IconButton
            onClick={onClose}
            sx={{ position: 'absolute', top: 8, right: 8, color: 'var(--mui-palette-text-secondary)' }}
          >
            <XIcon />
          </IconButton>
        </DialogContent>

        {/* Поля внизу */}
        <Box sx={{ padding: 2 }}>
          <Stack direction="row" spacing={2} justifyContent="space-between">
            {/* Поле "Автор инцидента" */}
            <TextField 
              label="Автор инцидента" 
              value={authorData ? `${authorData.name} ${authorData.surname}` : 'Джони Деп'} 
              fullWidth 
            />
            <TextField label="Сумма вознаграждения" value={`₸ ${product?.achievement_sum || '2000'}`} fullWidth />
          </Stack>
          <Stack direction="row" spacing={2} justifyContent="space-between" sx={{ mt: 2 }}>
            {/* <TextField
              label="Назначенный сотрудник"
              value={product?.set_employee_data?.name || 'Кайратов Кайрат Кайратович'}
              fullWidth
            /> */}
            <TextField 
              label="Дата создания" 
              value={product?.formattedCreatedAt || 'Нет данных'} 
              fullWidth 
            />
          </Stack>
        </Box>
      </Dialog>

      {/* Модальное окно с данными аналитики */}
      <Dialog open={analyticsOpen} onClose={handleAnalyticsClose} maxWidth="md">
        <DialogContent>
          <Typography variant="h6">Данные аналитики</Typography>
          {/* Визуализируем данные аналитики */}
          {product?.analytics_results?.map((result, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Typography variant="subtitle1">Номер или ИИН: {result.data || 'Нет данных'}</Typography>
              {result.crop && result.crop.content && (
                <Box
                  component="img"
                  src={`data:image/jpeg;base64,${result.crop.content}`}
                  alt="Кроп изображения"
                  sx={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover', borderRadius: 2 }}
                />
              )}
            </Box>
          ))}
          <Button onClick={handleAnalyticsClose}>Закрыть</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
