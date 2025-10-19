import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error("❌ Erro:", err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
};