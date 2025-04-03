// app/middleware.ts
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // 设置跨域头
  const response = new Response();
  response.headers.set('Access-Control-Allow-Origin', '*'); // 允许所有来源
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 处理 OPTIONS 请求（预检请求）
  if (request.method === 'OPTIONS') {
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*', // 匹配所有 API 路由
};