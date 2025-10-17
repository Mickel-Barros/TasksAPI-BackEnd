import { Router } from "express";
import * as taskController from "../controllers/taskController";
import { body, param } from "express-validator";
import { validateRequest } from "../validators/validateRequest";

const router = Router();

router.get("/", taskController.listTasks);

router.post(
  "/",
  body("title").isString().isLength({ min: 1 }).withMessage("title is required"),
  body("description").optional().isString(),
  validateRequest,
  taskController.createTask
);

export default router;