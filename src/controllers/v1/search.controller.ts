import { z } from 'zod';
import { db } from '../../db';
import { books } from '../../db/schema';
import { Request, Response } from 'express';
import { ilike, or, count } from 'drizzle-orm';

const booksSaecrhSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional().optional(),
});

export const searchBooks = async (req: Request, res: Response) => {
  try {
    // Parse and validate query parameters
    const queryResult = booksSaecrhSchema.safeParse(req.query);

    if (!queryResult.success) {
      res.status(400).json({
        error: 'Invalid query parameters',
        details: queryResult.error.format(),
      });
      return;
    }

    const { page, limit, search } = queryResult.data;

    // Build the query with conditional filters using the where method
    const booksResult = await db
      .select()
      .from(books)
      .where(
        or(
          search ? ilike(books.author, `%${search}%`) : undefined,
          search ? ilike(books.title, `%${search}%`) : undefined,
        ),
      )
      .limit(limit)
      .offset((page - 1) * limit);

    // Get total count for pagination metadata
    const [data] = await db
      .select({ count: count() })
      .from(books)
      .where(
        or(
          search ? ilike(books.author, `%${search}%`) : undefined,
          search ? ilike(books.title, `%${search}%`) : undefined,
        ),
      );

    // Return the response with pagination metadata
    res.status(200).json({
      data: booksResult,
      pagination: {
        total: data.count,
        page,
        limit,
      },
    });

    return;
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};
