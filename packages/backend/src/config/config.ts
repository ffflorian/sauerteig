import {loadEnvFile} from 'node:process';

export const IS_LOCAL = process.env['IS_LOCAL'] === 'true';

try {
  loadEnvFile('.env');
} catch {
  console.warn('Error loading .env file, using defaults and environment variables');
}

export const COMMIT = process.env['COMMIT'] || 'unknown';
export const FRONTEND_URL = process.env['FRONTEND_URL'] || 'http://localhost:5173';
export const MONGODB_URI = process.env['MONGODB_URI'] || 'mongodb://127.0.0.1:27017/sauerteig';
export const PORT = process.env['PORT'] || 3000;
export const VAPID_PRIVATE_KEY = process.env['VAPID_PRIVATE_KEY'] || '';
export const VAPID_PUBLIC_KEY = process.env['VAPID_PUBLIC_KEY'] || '';
export const VAPID_SUBJECT = process.env['VAPID_SUBJECT'] || 'mailto:admin@example.com';
export const VERSION = process.env['VERSION'] || 'unknown';
