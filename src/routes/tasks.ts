import { Router } from "express";
import * as taskController from "../controllers/taskController";
import { body, param } from "express-validator";
import { validateRequest } from "../validators/validateRequest";

const router = Router();
/**
 * @swagger
 * components:
 *   schemas:
 *     Task:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         id:
 *           type: integer
 *           readOnly: true
 *         title:
 *           type: string
 *           minLength: 1
 *         description:
 *           type: string
 *         completed:
 *           type: boolean
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         deletedAt:
 *           type: string
 *           format: date-time
 *   parameters:
 *     TaskId:
 *       in: path
 *       name: id
 *       required: true
 *       schema:
 *         type: integer
 *       description: ID da tarefa
 */

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Lista tarefas paginadas
 *     tags: [Tasks]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Lista de tarefas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Task'
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Cria nova tarefa
 *     tags: [Tasks]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       201:
 *         description: Tarefa criada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Task'
 */

/**
 * @swagger
 * /tasks/{id}:
 *   patch:
 *     summary: Atualiza tarefa
 *     tags: [Tasks]
 *     parameters:
 *       - $ref: '#/components/parameters/TaskId'
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Task'
 *     responses:
 *       200:
 *         description: Tarefa atualizada
 */

/**
 * @swagger
 * /tasks/{id}:
 *   delete:
 *     summary: Exclui tarefa
 *     tags: [Tasks]
 *     parameters:
 *       - $ref: '#/components/parameters/TaskId'
 *     responses:
 *       200:
 *         description: Tarefa excluída
 */

router.get("/", taskController.listTasks);

router.post(
  "/",
  body("title")
    .exists({ checkFalsy: true }).withMessage("Title is required")
    .bail()
    .isString().withMessage("Title must be a string"),
  body("description")
    .optional()
    .isString().withMessage("Description must be a string")
    .bail()
    .isLength({ min: 5 }).withMessage("Description must be at least 5 characters"),
  validateRequest,
  taskController.createTask
);


router.delete(
  "/:id",
  param("id").isInt().toInt(),
  validateRequest,
  taskController.deleteTask
);

router.patch(
  "/:id",
  param("id").isInt().toInt(),
  validateRequest,
  taskController.updateTaskController
);

export default router;

