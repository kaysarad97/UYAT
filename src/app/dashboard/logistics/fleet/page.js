'use client';

import * as React from 'react';
import { IncidentView } from '@/components/dashboard/logistics/incident-view'; // Убедитесь, что путь правильный
import { fetchApiWithAuth } from '@/lib/auth/custom/client';

export default function Page() {
  const [incidents, setIncidents] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

  // Функция для получения данных о инцидентах
  const fetchIncidents = async () => {
    try {
      console.log('Запрос инцидентов...'); // Логируем начало запроса
      const data = await fetchApiWithAuth('http://37.99.82.96:8000/api/v1/incident-web/', {
        method: 'GET',
      });

      if (Array.isArray(data)) {
        console.log('Инциденты получены успешно:', data); // Логируем успешный запрос
        setIncidents(data); // Обновляем состояние с данными инцидентов
      } else {
        console.error('Данные не являются массивом', data);
        setError('Некорректный ответ от сервера');
      }
    } catch (err) {
      console.error('Ошибка при получении инцидентов:', err); // Логируем ошибку для отладки
      setError('Ошибка при получении данных'); // Устанавливаем сообщение об ошибке
    } finally {
      setLoading(false); // Останавливаем индикатор загрузки после завершения запроса
    }
  };

  // Вызываем fetchIncidents при первом рендере компонента
  React.useEffect(() => {
    fetchIncidents();
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
<IncidentView incidents={incidents} setIncidents={setIncidents} />      )}
    </>
  );
}
