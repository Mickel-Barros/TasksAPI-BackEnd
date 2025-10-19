import request from "supertest";
import express from "express";
import tasksRouter from "../routes/tasks";
import { errorHandler } from "../middleware/errorHandler";

jest.mock("../services/taskService", () => ({
  createTask: jest.fn().mockResolvedValue({
    success: true,
    message: "Task created",
  }),
  listTasks: jest.fn(),
  deleteTask: jest.fn(),
  updateTask: jest.fn(),
}));

const app = express();
app.use(express.json());
app.use("/tasks", tasksRouter);
app.use(errorHandler);

describe("validateRequest middleware", () => {
  it("should return 400 if required fields are missing", async () => {
    const response = await request(app).post("/tasks").send({});

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe("Validation failed");
    expect(Array.isArray(response.body.errors)).toBe(true);
    expect(response.body.errors).toContain("title: Title is required");
  });

  it("should return 400 if description is too short", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ title: "Test Task", description: "123" });

    expect(response.status).toBe(400);
    expect(response.body.errors).toContain("description: Description must be at least 5 characters");
  });

  it("should pass validation with valid data", async () => {
    const response = await request(app)
      .post("/tasks")
      .send({ title: "Valid Title", description: "Valid description" });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe("Task created");
  });
});
