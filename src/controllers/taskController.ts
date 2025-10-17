import { Request, Response, NextFunction } from "express";
import * as taskService from "../services/taskService";

export async function listTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const tasks = await taskService.listTasks();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction) {
  try {
    const { title, description } = req.body;
    const task = await taskService.createTask({ title, description });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}