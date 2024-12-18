import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const queryClient = postgres(process.env.DATABASE_URL, { 
  prepare: false,
});

export const db = drizzle(queryClient, { schema });

export default db;