import { Request, Response, NextFunction } from 'express';

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void 
{
    console.error('[ERROR]', err.message);
    console.error('[STACK]', err.stack);

    res.status(500).json({
        error: 'Internal Server Error',
        message: err.message,
    });
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void 
{
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    
    if (Object.keys(req.query).length > 0)
        console.log('[QUERY]', req.query);
    
    next();
}