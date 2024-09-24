// 'use client';

// import * as React from 'react';
// import { IncidentView } from '@/components/dashboard/logistics/incident-view'; // Ensure path is correct
// import { fetchApiWithAuth } from '@/lib/auth/custom/client';

// export default function Page() {
//   const [incidents, setIncidents] = React.useState([]);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(null);

//   // Функция для получения данных о инцидентах
//   const fetchIncidents = async () => {
//     try {
//       // Используем fetchApiWithAuth для выполнения запроса с токеном
//       const data = await fetchApiWithAuth('http://37.99.82.96:8000/api/v1/incident-web/', {
//         method: 'GET',
//       });

//       if (Array.isArray(data)) {
//         setIncidents(data); // Обновляем состояние с данными инцидентов
//       } else {
//         console.error('Данные не являются массивом', data);
//         setError('Некорректный ответ от сервера');
//       }
//     } catch (err) {
//       setError('Ошибка при получении данных'); // Устанавливаем сообщение об ошибке
//       console.error('Ошибка при получении инцидентов:', err); // Логируем ошибку для отладки
//     } finally {
//       setLoading(false); // Останавливаем индикатор загрузки после завершения запроса
//     }
//   };

//   // Вызываем fetchIncidents при первом рендере компонента
//   React.useEffect(() => {
//     fetchIncidents();
//   }, []);

//   // Логика отображения компонента
//   if (loading) {
//     return <div>Загрузка...</div>; // Показываем сообщение о загрузке
//   }

//   if (error) {
//     return <div>{error}</div>; // Отображаем сообщение об ошибке
//   }

//   return (
//     <>
//       {incidents.length === 0 ? (
//         <div>Нет доступных инцидентов</div> // Отображаем сообщение, если инциденты не найдены
//       ) : (
//         <IncidentView incidents={incidents} /> // Отображаем компонент с инцидентами
//       )}
//     </>
//   );
//  }
// 'use client';

// import * as React from 'react';
// import { IncidentView } from '@/components/dashboard/logistics/incident-view'; // Ensure path is correct
// import { fetchApiWithAuth } from '@/lib/auth/custom/client';
// import TokenService from '@/lib/auth/custom/refresh';

// export default function Page() {
//   const [incidents, setIncidents] = React.useState([]);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(null);

//   // Функция для получения данных о инцидентах
//   const fetchIncidents = async () => {
//     try {
//       console.log('Запрашиваем данные инцидентов...');
      
//       // Используем fetchApiWithAuth для выполнения запроса с токеном
//       const data = await fetchApiWithAuth('http://37.99.82.96:8000/api/v1/incident-web/', {
//         method: 'GET',
//       });

//       console.log('Ответ данных:', data); // Логируем ответ для проверки

//       if (Array.isArray(data)) {
//         setIncidents(data); // Обновляем состояние с данными инцидентов
//       } else {
//         console.error('Ответ сервера не является массивом:', data); // Логируем некорректные данные
//         setError('Некорректный ответ от сервера');
//       }
//     } catch (err) {
//       console.error('Ошибка при запросе инцидентов:', err); // Логируем ошибку запроса
//       setError('Ошибка при получении данных');
//     } finally {
//       setLoading(false); // Останавливаем индикатор загрузки после завершения запроса
//     }
//   };

//   // Вызываем fetchIncidents при первом рендере компонента
//   React.useEffect(() => {
//     fetchIncidents();
//   }, []);

//   // Добавляем автоматическое обновление токенов
//   React.useEffect(() => {
//     const interval = setInterval(async () => {
//       try {
//         await TokenService.refreshTokens(); // Обновляем токены каждые 14 минут
//         console.log('Токен обновлён успешно');
//       } catch (error) {
//         console.error('Ошибка при обновлении токена:', error);
//       }
//     }, 840000); // Интервал 14 минут

//     return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
//   }, []);

//   // Логика отображения компонента
//   if (loading) {
//     return <div>Загрузка...</div>; // Показываем сообщение о загрузке
//   }

//   if (error) {
//     return <div>{error}</div>; // Отображаем сообщение об ошибке
//   }

//   return (
//     <>
//       {incidents.length === 0 ? (
//         <div>Нет доступных инцидентов</div> // Отображаем сообщение, если инциденты не найдены
//       ) : (
//         <IncidentView incidents={incidents} /> // Отображаем компонент с инцидентами
//       )}
//     </>
//   );
// }
'use client';

import * as React from 'react';
import { IncidentView } from '@/components/dashboard/logistics/incident-view'; // Ensure path is correct
import { fetchApiWithAuth } from '@/lib/auth/custom/client';
import TokenService from '@/lib/auth/custom/refresh';

export default function Page() {
  const [incidents, setIncidents] = React.useState([]);
  const [incidentHistory, setIncidentHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Функция для получения данных о инцидентах
  const fetchIncidents = async () => {
    try {
      console.log('Запрашиваем данные инцидентов...');
      
      // Используем fetchApiWithAuth для выполнения запроса с токеном
      const data = await fetchApiWithAuth('http://37.99.82.96:8000/api/v1/incident-web/', {
        method: 'GET',
      });

      console.log('Ответ данных:', data); // Логируем ответ для проверки

      if (Array.isArray(data)) {
        setIncidents(data); // Обновляем состояние с данными инцидентов
      } else {
        console.error('Ответ сервера не является массивом:', data); // Логируем некорректные данные
        setError('Некорректный ответ от сервера');
      }
    } catch (err) {
      console.error('Ошибка при запросе инцидентов:', err); // Логируем ошибку запроса
      setError('Ошибка при получении данных');
    }
  };

  // Функция для получения данных истории инцидентов
  const fetchIncidentHistory = async () => {
    try {
      console.log('Запрашиваем данные истории инцидентов...');

      // Используем fetchApiWithAuth для выполнения запроса с токеном
      const historyData = await fetchApiWithAuth('http://37.99.82.96:8000/api/v1/incident-web/history/', {
        method: 'GET',
      });

      console.log('Ответ данных истории:', historyData); // Логируем ответ для проверки

      if (Array.isArray(historyData)) {
        setIncidentHistory(historyData); // Обновляем состояние с данными истории инцидентов
      } else {
        console.error('Ответ сервера не является массивом истории:', historyData); // Логируем некорректные данные
        setError('Некорректный ответ от сервера при получении истории');
      }
    } catch (err) {
      console.error('Ошибка при запросе истории инцидентов:', err); // Логируем ошибку запроса
      setError('Ошибка при получении данных истории');
    }
  };

  // Вызываем оба запроса при первом рендере компонента
  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchIncidents(), fetchIncidentHistory()]); // Запрашиваем одновременно данные инцидентов и истории
      setLoading(false);
    };

    fetchData();
  }, []);

  // Добавляем автоматическое обновление токенов
  React.useEffect(() => {
    const interval = setInterval(async () => {
      try {
        await TokenService.refreshTokens(); // Обновляем токены каждые 14 минут
        console.log('Токен обновлён успешно');
      } catch (error) {
        console.error('Ошибка при обновлении токена:', error);
      }
    }, 840000); // Интервал 14 минут

    return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
  }, []);

  // Логика отображения компонента
  if (loading) {
    return <div>Загрузка...</div>; // Показываем сообщение о загрузке
  }

  if (error) {
    return <div>{error}</div>; // Отображаем сообщение об ошибке
  }

  return (
    <>
      {incidents.length === 0 ? (
        <div>Нет доступных инцидентов</div> // Отображаем сообщение, если инциденты не найдены
      ) : (
        <IncidentView incidents={incidents} /> // Отображаем компонент с инцидентами
      )}

      <h2>История инцидентов</h2>
      {incidentHistory.length === 0 ? (
        <div>Нет данных по истории инцидентов</div> // Отображаем сообщение, если истории инцидентов не найдено
      ) : (
        <IncidentView incidents={incidentHistory} /> // Отображаем компонент с историей инцидентов
      )}
    </>
  );
}

