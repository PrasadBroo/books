import {
  pgTable,
  integer,
  uuid,
  timestamp,
  text,
  index,
  unique,
} from 'drizzle-orm/pg-core';

import { users } from './users';
import { books } from './books';
import { relations } from 'drizzle-orm';

export const reviews = pgTable(
  'reviews',
  {
    review_id: uuid().defaultRandom().primaryKey(),
    user_id: uuid()
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    book_id: uuid()
      .notNull()
      .references(() => books.id, { onDelete: 'cascade' }),
    rating: integer('rating').notNull(),
    review_text: text('review_text'),
    created_at: timestamp({ precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
    updated_at: timestamp({ precision: 6, withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (reviews) => {
    return [
      index('idx_reviews_user_id').on(reviews.user_id),
      index('idx_reviews_book_id').on(reviews.book_id),
      unique('unique_user_book').on(reviews.user_id, reviews.book_id),
    ];
  },
);

export const reviewsBookRelations = relations(reviews, ({ one }) => ({
  book: one(books, {
    fields: [reviews.book_id],
    references: [books.id],
  }),
}));

export const reviewsUserRelations = relations(reviews, ({ one }) => ({
  user: one(users, {
    fields: [reviews.user_id],
    references: [users.id],
  }),
}));
