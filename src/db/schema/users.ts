import { relations, sql } from 'drizzle-orm';
import {
  pgTable,
  integer,
  varchar,
  uuid,
  timestamp,
  char,
  check,
} from 'drizzle-orm/pg-core';
import { books } from './books';
import { reviews } from './reviews';

export const users = pgTable(
  'users',
  {
    id: uuid().defaultRandom().primaryKey(),
    first_name: varchar({ length: 255 }).notNull(),
    last_name: varchar({ length: 255 }).notNull(),
    age: integer().notNull(),
    username: varchar({ length: 255 }).notNull().unique(),
    email: varchar({ length: 255 }).notNull().unique(),
    password: char({ length: 60 }).notNull(),
    created_at: timestamp({ precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp({ precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => [check('age_check', sql`${t.age} > 12 and ${t.age} < 110`)],
);

export const usersBooksRelations = relations(users, ({ many }) => ({
  books: many(books),
  reviews: many(reviews),
}));

export type TUser = {
  id: string;
  first_name: string;
  last_name: string;
  age: number;
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date;
};
