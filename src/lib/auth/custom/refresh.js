
  'use client';

export async function fetchApi(url, options) {
  try {
    const response = await fetch(url, options);

    // Если статус 204 No Content, возвращаем null, так как тело ответа отсутствует
    if (response.status === 204 || response.status === 205) {
      return null;
    }

    // Попытка прочитать тело ответа как JSON
    try {
      return await response.json();
    } catch (err) {
      // Если парсинг JSON не удался, проверяем, есть ли текст в ответе
      const text = await response.text();
      if (text) {
        return { message: text }; // Возвращаем текстовое сообщение, если есть
      }
      throw new Error('Unknown error occurred');
    }

  } catch (error) {
    // Если произошла ошибка, выбрасываем её с сообщением
    throw new Error(error.message || 'Network error');
  }
}

  class TokenService {
    static setTokens({ access_token, refresh_token }) {
      console.log('Saving tokens:', { access_token, refresh_token }); // Логируем установку токенов
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('refresh_token', refresh_token);
    }
  
    static getAccessToken() {
      const accessToken = localStorage.getItem('access_token');
      // console.log('Получение токена:', accessToken); // Логируем получение токена
      return accessToken;
    }
  
    static getRefreshToken() {
      const refreshToken = localStorage.getItem('refresh_token');
      console.log('Текущий refresh_token:', refreshToken);
 // Логируем получение refresh токена
      return refreshToken;
    }
  
    static clearTokens() {
      console.log('Clearing tokens'); // Логируем очистку токенов
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
  
    static async refreshTokens() {
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        console.error('No refresh token available');
        throw new Error('No refresh token available');
      }
    
      try {
        console.log('Refreshing token with refresh_token:', refreshToken); // Логируем процесс обновления
    
        const response = await fetch('http://37.99.82.96:8000/api/v1/admins/refresh/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }), // Отправляем только refresh_token
        });
    
        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            console.error('Invalid token. Redirecting to login.');
            this.clearTokens(); 
            window.location.href = '/login'; // Перенаправление на страницу авторизации
            throw new Error('Токен недействителен, необходимо повторно авторизоваться.');
          }
    
          const errorData = await response.json();
          console.error('Ошибка при обновлении токена:', response.status, response.statusText, errorData);
          throw new Error(errorData.error || errorData.message || 'Unknown refresh error');
        }
    
        const data = await response.json();
        console.log('Новые токены получены:', data); // Логируем новые токены
    
        if (data.access_token && data.refresh_token) {
          this.setTokens({
            access_token: data.access_token,
            refresh_token: data.refresh_token,
          });
        } else {
          throw new Error('Invalid token response during refresh');
        }
    
        return data;
      } catch (error) {
        console.error('Не удалось обновить токен:', error);
        this.clearTokens(); // Очищаем токены при неудачном обновлении
        throw new Error('Не удалось обновить токен: ' + error.message);
      }
    }
      }  

  export default TokenService;
