import { Request, Response } from 'express';

export interface GraphQLContext {
  req: Request & { user?: { id: string; email: string; name: string } };
  res: Response;
}
