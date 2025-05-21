import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/env';
import { db } from '../db';
import { users } from '../db/schema';
import { eq } from 'drizzle-orm';

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.json({ error: 'Authentication token required' }).status(401);
  }

  try {
    const user = jwt.verify(token, config.JWT_SECRET);

    // fetch user from db

    const [userinfo] = await db
      .select({
        id: users.id,
        first_name: users.first_name,
        last_name: users.last_name,
        age: users.age,
        username: users.username,
        email: users.email,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, user?.sub as string));
    // Add the user to the request object
    req.user = userinfo;
    next();
    return;
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};
