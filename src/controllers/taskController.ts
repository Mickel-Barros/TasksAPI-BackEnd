import { Request, Response, NextFunction } from "express";
import * as taskService from "../services/taskService";
import sanitize from "sanitize-html";

export async function listTasks(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const tasks = await taskService.listTasks(page, limit);
    res.json(tasks);
  } catch (err) {
    next(err);
  }
}

export async function createTask(req: Request, res: Response, next: NextFunction) {
  try {
    const title = sanitize(req.body.title);
    const description = sanitize(req.body.description || "");

    if (!title || title.trim() === "") {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

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
  } catch (err: any) {
    if (err.code === 'P2025' || err.message === "Task not found") {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    next(err);
  }
}

export async function updateTaskController(req: Request, res: Response, next: NextFunction) {
  try {
    const id = Number(req.params.id);
    const task = await taskService.updateTask(id, req.body);

    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.json(task);
  } catch (err: any) {
    if (err.code === 'P2025' || err.message === "Task not found") {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    next(err);
  }
}
