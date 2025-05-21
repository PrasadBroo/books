import { Request, Response } from 'express';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { db } from '../../db';
import { users } from '../../db/schema/users';
import config from '../../config/env';

// Zod validation schemas
const signupSchema = z.object({
  username: z.string().min(3).max(50),
  email: z.string().email().max(100),
  password: z.string().min(8).max(100),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  age: z.number().min(12).max(110),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const signup = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const result = signupSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: result.error.format(),
      });
      return;
    }

    const { username, email, password, firstName, lastName, age } = result.data;

    // Check if user already exists
    const existingUser = await db.query.users.findFirst({
      where: (users) => {
        return eq(users.email, email) || eq(users.username, username);
      },
    });

    if (existingUser) {
      res.status(409).json({
        error: 'User already exists with this email or username',
      });
      return;
    }

    // Hash the password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Insert new user
    const [newUser] = await db
      .insert(users)
      .values({
        username,
        email,
        password: passwordHash,
        first_name: firstName,
        last_name: lastName,
        age: age,
      })
      .returning({
        userId: users.id,
        username: users.username,
        email: users.email,
      });

    // Generate JWT token
    const token = jwt.sign(
      { sub: newUser.userId, email: newUser.email },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN },
    );

    // Return success response with token
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        userId: newUser.userId,
        username: newUser.username,
        email: newUser.email,
      },
      token,
    });
    return;
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    // Validate request body
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: 'Validation failed',
        details: result.error.format(),
      });
      return;
    }

    const { email, password } = result.data;

    // Find user by email
    const user = await db.query.users.findFirst({
      where: (users) => eq(users.email, email),
    });

    // dont tell user that user doesnt exist
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: 'Invalid email or password' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      config.JWT_SECRET,
      { expiresIn: config.JWT_EXPIRES_IN },
    );

    // Return success response with token
    res.status(200).json({
      message: 'Login successful',
      user: {
        userId: user.id,
        username: user.username,
        email: user.email,
      },
      token,
    });
    return;
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
};
