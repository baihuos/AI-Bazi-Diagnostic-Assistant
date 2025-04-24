import { defineConfig } from 'vite';
import uni from '@dcloudio/vite-plugin-uni';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [uni()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'), // 确保路径正确
    },
  },
  define: {
    // 注入全局环境变量
    __APP_ENV__: JSON.stringify(process.env),
  },
  // 开发服务器配置（代理）
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
        
      }
    }
  },
  // 构建配置
  build: {
    minify: mode === 'production' ? 'terser' : false,
    sourcemap: mode !== 'production'
  }
}));