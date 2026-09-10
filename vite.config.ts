import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import {defineConfig} from 'vite';

const errorLoggerPlugin = {
  name: 'error-logger',
  configureServer(server: any) {
    server.middlewares.use((req: any, res: any, next: any) => {
      if (req.url === '/api/client-error' && req.method === 'POST') {
        let body = '';
        req.on('data', (chunk: any) => body += chunk);
        req.on('end', () => {
          try {
            fs.appendFileSync('client-errors.log', body + '\n---\n');
            console.error('CLIENT_ERROR_REPORTED:', body);
          } catch (e) {}
          res.statusCode = 200;
          res.end('ok');
        });
        return;
      }
      next();
    });
  }
};

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), errorLoggerPlugin],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
      dedupe: ['react', 'react-dom'],
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true as const,
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      port: 3000,
      host: '0.0.0.0',
      allowedHosts: true as const,
    },
  };
});
