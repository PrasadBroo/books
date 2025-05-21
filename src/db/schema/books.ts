import {
  pgTable,
  integer,
  varchar,
  uuid,
  timestamp,
  text,
  date,
  index,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { relations } from 'drizzle-orm';
import { reviews } from './reviews';

export const books = pgTable(
  'books',
  {
    id: uuid().defaultRandom().primaryKey(),
    title: text().notNull(),
    author: varchar({ length: 100 }).notNull(),
    genre: varchar({ length: 100 }).notNull(),
    page_count: integer().notNull(),
    description: varchar({ length: 255 }).notNull(),
    publication_date: date().defaultNow().notNull(),
    added_by: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    created_at: timestamp({ precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp({ precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (t) => {
    return [
      index('idx_books_author').on(t.author),
      index('idx_books_title').on(t.title),
      index('idx_books_added_by').on(t.added_by),
    ];
  },
);

export const booksUserRelations = relations(books, ({ one, many }) => ({
  user: one(users, {
    fields: [books.added_by],
    references: [users.id],
  }),
  reviews: many(reviews),
}));
