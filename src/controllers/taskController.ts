import { Request, Response, NextFunction } from "express";
import * as taskService from "../services/taskService";
import sanitize from "sanitize-html";


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
    const title = sanitize(req.body.title);
    const description = sanitize(req.body.description);

    const task = await taskService.createTask({ title, description });
    res.status(201).json(task);
  } catch (err) {
    next(err);
  }
}

export async function deleteTask(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    await taskService.deleteTask(id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function completeTask(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const task = await taskService.markComplete(id);
    res.json(task);
  } catch (err) {
    next(err);
  }
}