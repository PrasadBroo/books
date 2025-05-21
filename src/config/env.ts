import dotenv from 'dotenv';
import { SignOptions } from 'jsonwebtoken';
import path from 'path';

const projectDir = path.resolve(__dirname, '..', '..');
dotenv.config({ path: projectDir + '/.env' });

type StringValue = SignOptions['expiresIn'];
type Config = {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: StringValue;
};

const config: Config = {
  PORT: Number(process.env.PORT) || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL:
    process.env.DATABASE_URL ||
    'postgresql://postgres:postgres@localhost:5432/postgres',
  JWT_SECRET: process.env.JWT_SECRET || 'jwt-secret',
  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN as StringValue) || '7d',
};

export default config;
