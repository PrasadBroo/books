import { Request, Response } from 'express';
import { and, eq } from 'drizzle-orm';
import { db } from '../../db';
import { reviews } from '../../db/schema';
import { z } from 'zod';

const updateReviewSchema = z
  .object({
    text: z
      .string()
      .min(1, 'Review text is required')
      .max(255, 'Review text must be less than 255 characters')
      .optional(),
    rating: z
      .number()
      .int('Rating must be a whole number')
      .min(1, 'Rating must be at least 1')
      .max(5, 'Rating cannot exceed 5')
      .optional(),
  })
  .refine((data) => data.text !== undefined || data.rating !== undefined, {
    message: 'Either text or rating must be provided',
    path: ['text'],
  });

export const updateReview = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.review_id;
    const userId = req.user?.id!;

    // Check if review exists and belongs to the user
    const [existingReview] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.review_id, reviewId));

    if (!existingReview) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    if (existingReview.user_id !== userId) {
      res.status(403).json({ error: 'You can only update your own reviews' });
      return;
    }

    const result = updateReviewSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: result.error.format(),
      });
      return;
    }

    const reviewData = result.data;

    // Build update object with only provided fields
    const updateData: { review_text?: string; rating?: number } = {};
    if (reviewData.rating !== undefined) {
      updateData.rating = reviewData.rating;
    }
    if (reviewData.text !== undefined) {
      updateData.review_text = reviewData.text;
    }

    const [updatedReview] = await db
      .update(reviews)
      .set(updateData)
      .where(
        and(
          eq(reviews.review_id, reviewId),
          eq(reviews.user_id, req.user?.id!),
        ),
      )
      .returning();

    res.status(200).json({
      message: 'Review updated successfully',
      review: updatedReview,
    });
    return;
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};

export const deleteReview = async (req: Request, res: Response) => {
  try {
    const reviewId = req.params.review_id;
    const userId = req.user?.id!;

    // Check if review exists and belongs to the user
    const [existingReview] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.review_id, reviewId));

    if (!existingReview) {
      res.status(404).json({ error: 'Review not found' });
      return;
    }

    if (existingReview.user_id !== userId) {
      res.status(403).json({ error: 'You can only delete your own reviews' });
      return;
    }

    await db.delete(reviews).where(eq(reviews.review_id, reviewId));

    res.status(200).json({
      message: 'Review deleted successfully',
    });
    return;
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};
