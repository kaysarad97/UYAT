// 'use client';

// import * as React from 'react';
// import { IncidentView } from '@/components/dashboard/logistics/IncidentView';
// import { TokenService } from '@/lib/auth/custom/client'; // Импортируем TokenService для работы с токенами

// export default function Page() {
//   const [incidents, setIncidents] = React.useState([]);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(null);

//   // Запрос данных с API
//   React.useEffect(() => {
//     const fetchIncidents = async () => {
//       const accessToken = TokenService.getAccessToken();
//       console.log('Токен перед запросом:', accessToken); // Проверка перед запросом

//       if (!accessToken) {
//         console.error('Ошибка: Токен отсутствует');
//         setError('Токен отсутствует');
//         return;
//       }

//       try {
//         const response = await fetch('http://37.99.82.96:8000/api/v1/incident-web/', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${accessToken}`, // Передача токена в запрос
//             'Content-Type': 'application/json',
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Ошибка: ${response.statusText}`);
//         }

//         const data = await response.json();
//         console.log('API Response:', data);

//         // Преобразуем данные в нужный формат
//         const formattedIncidents = data.map((item) => ({
//           id: item.id,
//           title: item.title || 'Без названия',
//           latitude: item.geo.coordinates[1],
//           longitude: item.geo.coordinates[0],
//           status: item.status || 'Неизвестен',
//           tags: item.tags || 'Без тегов',
//           media_url: item.media_url.length > 0 ? item.media_url : ['/assets/default.jpg'],
//         }));

//         setIncidents(formattedIncidents);
//         setLoading(false);
//       } catch (error) {
//         console.error('Ошибка при получении данных:', error);
//         setError(error.message);
//         setLoading(false);
//       }
//     };

//     fetchIncidents();
//   }, []);

//   if (loading) {
//     return <div>Загрузка данных...</div>;
//   }

//   if (error) {
//     return <div>Ошибка загрузки данных: {error}</div>;
//   }

//   // Передаем загруженные данные в компонент IncidentView
//   return <IncidentView incidents={incidents} />;
// }
