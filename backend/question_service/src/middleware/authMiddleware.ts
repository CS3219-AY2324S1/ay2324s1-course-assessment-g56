import { createClient } from '@supabase/supabase-js';
import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const supabase = createClient(
  process.env.SUPABASE_URL || '',
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
      jwt.verify(accessToken!, process.env.SUPABASE_JWT_SECRET!);
    } catch (error) {
      res.status(401).json({
        errors: [{ msg: 'Not authorized, access token failed' }],
      });
      return;
    }
    next();
  }
}

export async function protectAdmin(
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
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', decoded?.sub)
        .single();
      if (profileData?.role === 'Maintainer') {
        next();
      } else {
        res.status(401).json({
          errors: [{ msg: 'Not admin authorized, access token failed' }],
        });
      }
    } catch {
      res.status(401).json({
        errors: [{ msg: 'Not admin authorized, access token failed' }],
      });
    }
  }
}
