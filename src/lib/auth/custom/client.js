// 'use client';

// import TokenService, { fetchApi } from './refresh';

// async function fetchApiWithAuth(url, options) {
//   let accessToken = TokenService.getAccessToken();

//   const modifiedOptions = {
//     ...options,
//     headers: {
//       ...options.headers,
//       'Authorization': `Bearer ${accessToken}`, // Добавляем токен в заголовки
//     },
//   };

//   try {
//     // fetchApi уже возвращает JSON, нет необходимости вызывать .json()
//     const response = await fetchApi(url, modifiedOptions);

//     if (response.status === 204 || response.status === 205) {
//       return null; // Успешный запрос, но нет данных для отображения
//     }
//     // Проверка на null, если возвращен статус 204 или 205
//     if (response === null) {
//       throw new Error('Нет данных для отображения'); // Логируем и обрабатываем
//     }

//     return response; // Возвращаем JSON с данными
//   } catch (error) {
//     console.error('Первоначальный запрос не удался:', error);

//     if (error.message.includes('401')) { // Если ошибка 401 (Unauthorized)
//       try {
//         console.log('Access token истек, пытаемся обновить');
//         await TokenService.refreshTokens();
//         accessToken = TokenService.getAccessToken();
      
//         modifiedOptions.headers['Authorization'] = `Bearer ${accessToken}`;
      
//         // Повторяем запрос с новым токеном
//         const retryResponse = await fetchApi(url, modifiedOptions);
//         console.log('Retry JSON response:', retryResponse); // Логируем успешный повторный JSON-ответ
      
//         return retryResponse; // Возвращаем обновленный JSON с данными
//       } catch (refreshError) {
//         console.error('Не удалось обновить токен:', refreshError);
//         TokenService.clearTokens();
//         throw refreshError;
//       }
      
//     }

//     throw error;
//   }
// }

// export { fetchApiWithAuth };

'use client';

import TokenService, { fetchApi } from './refresh';

async function fetchApiWithAuth(url, options) {
  let accessToken = TokenService.getAccessToken();

  const modifiedOptions = {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${accessToken}`, // Добавляем токен в заголовки
    },
  };

  try {
    const response = await fetchApi(url, modifiedOptions);

    // Если ответ с кодом 204 или 205, возвращаем null (успешный запрос без данных)
    if (response && (response.status === 204 || response.status === 205)) {
      return null; // Успешный запрос без данных для отображения
    }

    // Если response равен null или undefined, выбрасываем ошибку
    if (!response) {
      return null; // Нормальное поведение для 204/205
    }

    return response; // Возвращаем успешный JSON-ответ
  } catch (error) {
    console.error('Первоначальный запрос не удался:', error);

    // Обработка ошибки 401 (Unauthorized)
    if (error.message.includes('401')) {
      try {
        console.log('Access token истек, обновляем токен...');
        await TokenService.refreshTokens();
        accessToken = TokenService.getAccessToken();
      
        modifiedOptions.headers['Authorization'] = `Bearer ${accessToken}`;
      
        // Повторяем запрос с новым токеном
        const retryResponse = await fetchApi(url, modifiedOptions);

        // Проверка статуса повторного запроса (204/205)
        if (retryResponse && (retryResponse.status === 204 || retryResponse.status === 205)) {
          return null; // Успешный повторный запрос без данных
        }

        return retryResponse; // Возвращаем повторный успешный JSON-ответ
      } catch (refreshError) {
        console.error('Ошибка при обновлении токена:', refreshError);
        TokenService.clearTokens(); // Очищаем токены при ошибке обновления
        throw refreshError;
      }
    }

    throw error;
  }
}

export { fetchApiWithAuth };

class AuthClient {
  async signInWithPassword(params) {
    const { username, password } = params;
  
    try {
      const response = await fetchApi('http://37.99.82.96:8000/api/v1/admins/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const { access_token, refresh_token } = response;
      if (!access_token || !refresh_token) {
        return { error: 'Invalid credentials' };
      }
  
      // Сохраняем токены и username
      TokenService.setTokens({ access_token, refresh_token });
      localStorage.setItem('username', username); // Сохраняем username для использования при обновлении токена
  
      // Возвращаем данные токенов или другие данные
      return { data: { access_token } };
    } catch (error) {
      return { error: error.message };
    }
  }

  // Остальные методы остаются без изменений...

  

  async resetPassword(_) {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_) {
    return { error: 'Password update not implemented' };
  }

  async getUser() {
    const token = TokenService.getAccessToken();

    if (!token) {
      return { data: null };
    }

    return { data: { token } };
  }

  async signOut() {
    TokenService.clearTokens();
    return {};
  }
}

export const authClient = new AuthClient();
