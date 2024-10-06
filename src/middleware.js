// import { NextResponse } from 'next/server';

// import { config as appConfig } from '@/config';
// import { AuthStrategy } from '@/lib/auth/strategy';
// import { supabaseMiddleware } from '@/lib/auth/supabase/middleware';

// export async function middleware(req) {
//   let res;

//   if (appConfig.auth.strategy === AuthStrategy.SUPABASE) {
//     res = await supabaseMiddleware(req);
//   } else {
//     res = NextResponse.next({ headers: req.headers });
//   }

//   return res;
// }

// export const config = { matcher: ['/auth/:path*', '/dashboard/:path*'] };
import { NextResponse } from 'next/server';
import { config as appConfig } from '@/config';
import { AuthStrategy } from '@/lib/auth/strategy';
import { supabaseMiddleware } from '@/lib/auth/supabase/middleware';

export async function middleware(req) {
  const { pathname } = req.nextUrl;  // Получаем текущий путь запроса
  let res;

  // Проверяем, если путь запроса - корневой URL ("/"), и перенаправляем на страницу авторизации
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = '/auth/custom/sign-in';  // Перенаправляем на страницу авторизации
    return NextResponse.redirect(url);
  }

  // Если используется стратегия Supabase
  if (appConfig.auth.strategy === AuthStrategy.SUPABASE) {
    res = await supabaseMiddleware(req);
  } else {
    // Продолжаем обработку, если другой тип авторизации
    res = NextResponse.next({ headers: req.headers });
  }

  return res;
}

// Настраиваем middleware на срабатывание для /auth и /dashboard
export const config = { matcher: ['/', '/auth/:path*', '/dashboard/:path*'] };
