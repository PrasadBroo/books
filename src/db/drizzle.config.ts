import { defineConfig } from 'drizzle-kit';
import config from '../config/env';

export default defineConfig({
  out: './drizzle',
  schema: './schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.DATABASE_URL!,
  },
});
