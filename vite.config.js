import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from both the root and frontend directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Simple Vite plugin to mock the Vercel serverless function locally
const vercelApiPlugin = () => ({
  name: 'vercel-api-plugin',
  configureServer(server) {
    server.middlewares.use('/api/prefetch', async (req, res, next) => {
      try {
        // Dynamically import the handler so it always gets fresh code
        const handler = await server.ssrLoadModule('/api/prefetch.js');
        
        // Mock req.query
        const url = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
        req.query = Object.fromEntries(url.searchParams);
        
        // Mock res.status().json()
        res.status = (code) => {
          res.statusCode = code;
          return res;
        };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
        };
        
        await handler.default(req, res);
      } catch (err) {
        console.error(err);
        res.statusCode = 500;
        res.end(JSON.stringify({ error: err.message }));
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), vercelApiPlugin()],
});
