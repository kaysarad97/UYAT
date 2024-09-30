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
    // fetchApi уже возвращает JSON, нет необходимости вызывать .json()
    const response = await fetchApi(url, modifiedOptions);

    // console.log('Initial JSON response:', response); // Логируем успешный JSON-ответ

    return response; // Возвращаем JSON с данными
  } catch (error) {
    console.error('Первоначальный запрос не удался:', error);

    if (error.message.includes('401')) { // Если ошибка 401 (Unauthorized)
      try {
        console.log('Access token истек, пытаемся обновить');
        await TokenService.refreshTokens();
        accessToken = TokenService.getAccessToken();

        modifiedOptions.headers['Authorization'] = `Bearer ${accessToken}`;

        // Повторяем запрос с новым токеном
        const retryResponse = await fetchApi(url, modifiedOptions);
        console.log('Retry JSON response:', retryResponse); // Логируем успешный повторный JSON-ответ

        return retryResponse; // Возвращаем обновленный JSON с данными
      } catch (refreshError) {
        console.error('Не удалось обновить токен:', refreshError);
        TokenService.clearTokens();
        throw refreshError;
      }
    }

    throw error;
  }
}

export { fetchApiWithAuth };

// async function fetchApiWithAuth(url, options) {
//   let accessToken = TokenService.getAccessToken(); // Получаем access_token

//   console.log('Access token:', accessToken); // Логируем access_token перед запросом

//   const modifiedOptions = {
//     ...options,
//     headers: {
//       ...options.headers,
//       'Authorization': `Bearer ${accessToken}`, // Добавляем токен в заголовки
//     },
//   };

//   console.log('Sending request with headers:', modifiedOptions.headers); // Логируем заголовки

//   try {
//     const response = await fetchApi(url, modifiedOptions);
//     console.log('Initial response:', response); // Логируем успешный ответ
//     return response;
//   } catch (error) {
//     console.error('Первоначальный запрос не удался:', error); // Логируем ошибку

//     if (error.message.includes('401')) { // Если ошибка 401 (Unauthorized)
//       try {
//         console.log('Access token истек, пытаемся обновить'); // Логируем истечение токена

//         await TokenService.refreshTokens(); // Обновляем токен
//         accessToken = TokenService.getAccessToken(); // Получаем новый access_token
//         console.log('New access token:', accessToken); // Логируем новый токен

//         modifiedOptions.headers['Authorization'] = `Bearer ${accessToken}`; // Обновляем заголовки

//         // Повторяем запрос с новым токеном
//         const retryResponse = await fetchApi(url, modifiedOptions);
//         console.log('Retry response:', retryResponse); // Логируем успешный повторный запрос
//         return retryResponse;
//       } catch (refreshError) {
//         console.error('Не удалось обновить токен:', refreshError); // Логируем ошибку обновления
//         TokenService.clearTokens(); // Очищаем токены при сбое
//         throw refreshError; // Пробрасываем ошибку
//       }
//     }

//     throw error; // Пробрасываем ошибку для других случаев
//   }
// }





class AuthClient {
  async signUp(_) {
    return { error: 'Sign-up not implemented' };
  }

  async signInWithOAuth(_) {
    return { error: 'Social authentication not implemented' };
  }

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

      // Store the tokens
      TokenService.setTokens({ access_token, refresh_token });

      // Return user data or token as needed
      return { data: { access_token } };
    } catch (error) {
      return { error: error.message };
    }
  }

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
