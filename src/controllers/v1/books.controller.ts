import { Request, Response } from 'express';
import { z } from 'zod';
import { eq, avg, or, ilike, count } from 'drizzle-orm';
import { db } from '../../db';
import { books, reviews } from '../../db/schema';

// Zod validation schemas
const createBookSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  author: z
    .string()
    .min(1, 'Author is required')
    .max(100, 'Author name must be less than 100 characters'),
  genre: z
    .string()
    .min(1, 'Author is required')
    .max(100, 'Author name must be less than 100 characters'),
  publicationDate: z.string(),
  description: z
    .string()
    .max(255, 'Description must be less than 255 characters'),
  pageCount: z
    .number()
    .int('Page count must be a whole number')
    .positive('Page count must be positive'),
});

const bookQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().optional().optional(),
});

export const getBooks = async (req: Request, res: Response) => {
  try {
    // Parse and validate query parameters
    const queryResult = bookQuerySchema.safeParse(req.query);

    if (!queryResult.success) {
      res.status(400).json({
        error: 'Invalid query parameters',
        details: queryResult.error.format(),
      });
      return;
    }

    const { page, limit } = queryResult.data;

    // Build the query with conditional filters using the where method
    const booksResult = await db
      .select()
      .from(books)
      .where(
        or(
          queryResult.data.search
            ? ilike(books.author, `%${queryResult.data.search}%`)
            : undefined,
          queryResult.data.search
            ? ilike(books.genre, `%${queryResult.data.search}%`)
            : undefined,
        ),
      )
      .limit(limit)
      .offset(page * limit);

    // Get total count for pagination metadata
    const [data] = await db
      .select({ count: count() })
      .from(books)
      .where(
        or(
          queryResult.data.search
            ? ilike(books.author, `%${queryResult.data.search}%`)
            : undefined,
          queryResult.data.search
            ? ilike(books.genre, `%${queryResult.data.search}%`)
            : undefined,
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

export const getBookById = async (req: Request, res: Response) => {
  try {
    const bookId = req.params.book_id;
    const queryResult = bookQuerySchema.safeParse(req.query);

    if (!queryResult.success) {
      res.status(400).json({
        error: 'Invalid query parameters',
        details: queryResult.error.format(),
      });
      return;
    }
    const [book] = await db.select().from(books).where(eq(books.id, bookId));

    if (!book) {
      res.status(404).json({ error: 'Book not found' });
      return;
    }
    const reviews_list = await db.query.reviews.findMany({
      where: eq(reviews.book_id, book.id),
      limit: queryResult.data.limit,
      offset: queryResult.data.limit * queryResult.data.page,
    });
    const [avg_rating] = await db
      .select({ average: avg(reviews.rating) })
      .from(reviews)
      .groupBy(reviews.book_id)
      .where(eq(reviews.book_id, book.id));
    const result = {
      ...book,
      average_rating: avg_rating?.average,
      reviews: reviews_list,
    };

    res.status(200).json(result);
    return;
  } catch (error) {
    console.error('Get book by ID error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};

export const createBook = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const result = createBookSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: result.error.format(),
      });
      return;
    }

    const bookData = result.data;

    // Insert new book
    const [newBook] = await db
      .insert(books)

      .values({
        title: bookData.title,
        description: bookData.description,
        author: bookData.author,
        page_count: bookData.pageCount,
        publication_date: bookData.publicationDate,
        added_by: req.user?.id!,
        genre: bookData.genre,
      })
      .returning();

    res.status(201).json({
      message: 'Book created successfully',
      book: newBook,
    });
    return;
  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};
