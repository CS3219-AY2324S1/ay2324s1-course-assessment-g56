import { createClient } from '@supabase/supabase-js';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const supabase = createClient(
  `https://${process.env.SUPABASE_URL}` || '',
  process.env.SUPABASE_SERVICE_KEY || '',
);

export async function verifyAccessToken(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res
      .status(401)
      .json({ errors: [{ msg: 'Not authorized, no access token' }] });
  } else {
    const accessToken = authHeader.split('Bearer ').pop();
    try {
      const decoded = jwt.verify(
        accessToken!,
        process.env.SUPABASE_JWT_SECRET!,
      ) as JwtPayload;
      res.locals.user = decoded?.sub;
    } catch (error) {
      res.status(401).json({
        errors: [{ msg: 'Not authorized, access token failed' }],
      });
      return;
    }
    next();
  }
}
