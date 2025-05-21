import { relations } from 'drizzle-orm';
import {
  pgTable,
  integer,
  varchar,
  uuid,
  timestamp,
  char,
} from 'drizzle-orm/pg-core';
import { books } from './books';

export const users = pgTable('users', {
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
});

export const usersBooksRelations = relations(users, ({ many }) => ({
  books: many(books),
}));

export const userReviewRelations = relations(users, ({ many }) => ({
  user: many(books),
}));
