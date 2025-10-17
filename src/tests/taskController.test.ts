import request from "supertest";
import app from "../app";
import * as service from "../services/taskService";

jest.mock("../services/taskService");

describe("Task Controller & Routes", () => {
  beforeEach(() => jest.clearAllMocks());

  it("GET /tasks → deve listar tarefas", async () => {
    const mockTasks = [{ id: 1, title: "Test", completed: false, description: "", createdAt: "2025-10-17T23:30:25.398Z", }];
    (service.listTasks as jest.Mock).mockResolvedValue(mockTasks);

    const res = await request(app).get("/tasks");
    expect(res.status).toBe(200);
    expect(res.body).toEqual(mockTasks);
    expect(service.listTasks).toHaveBeenCalled();
  });

  it("POST /tasks → cria tarefa válida", async () => {
    const task = { id: 2, title: "Nova", completed: false, description: "Teste", createdAt: "2025-10-17T23:30:25.398Z", };
    (service.createTask as jest.Mock).mockResolvedValue(task);

    const res = await request(app)
      .post("/tasks")
      .send({ title: "Nova", description: "Teste" });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe("Nova");
    expect(service.createTask).toHaveBeenCalledWith({ title: "Nova", description: "Teste" });
  });

  it("POST /tasks → falha se title estiver ausente", async () => {
    const res = await request(app)
      .post("/tasks")
      .send({ description: "sem título" });

    expect(res.status).toBe(400);
    expect(res.body.errors[0].param).toBe("title");
  });

  it("DELETE /tasks/:id → deleta tarefa existente", async () => {
    (service.deleteTask as jest.Mock).mockResolvedValue(undefined);

    const res = await request(app).delete("/tasks/5");
    expect(res.status).toBe(204);
    expect(service.deleteTask).toHaveBeenCalledWith(5);
  });

  it("PATCH /tasks/:id/complete → marca como concluída", async () => {
    const completed = { id: 5, title: "Feita", completed: true, description: null, createdAt: new Date() };
    (service.markComplete as jest.Mock).mockResolvedValue(completed);

    const res = await request(app).patch("/tasks/5/complete");

    expect(res.status).toBe(200);
    expect(res.body.completed).toBe(true);
    expect(service.markComplete).toHaveBeenCalledWith(5);
  });
});
