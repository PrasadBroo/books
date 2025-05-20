import { defineConfig } from 'drizzle-kit';
import config from '../config/env';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: config.databaseUrl!,
  },
});
