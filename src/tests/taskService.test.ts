import * as service from "../services/taskService";
import prisma from "../db/prismaClient";

jest.mock("../db/prismaClient", () => ({
  task: {
    findMany: jest.fn(),
    create: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
}));

describe("taskService", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("listTasks returns tasks", async () => {
    const fake = [{ id:1, title: "t", description: "d", completed:false, createdAt: new Date() }];
    (prisma.task.findMany as jest.Mock).mockResolvedValue(fake);
    const r = await service.listTasks();
    expect(r).toBe(fake);
    expect(prisma.task.findMany).toHaveBeenCalled();
  });

  it("createTask creates", async () => {
    const input = { title: "hello" };
    const out = { id:2, ...input, description: null, completed:false, createdAt: new Date() };
    (prisma.task.create as jest.Mock).mockResolvedValue(out);
    const r = await service.createTask(input as any);
    expect(r).toEqual(out);
    expect(prisma.task.create).toHaveBeenCalledWith(expect.objectContaining({ data: expect.objectContaining({ title: "hello" }) }));
  });

  it("markComplete updates", async () => {
    const out = { id:3, title:"x", description:null, completed:true, createdAt: new Date() };
    (prisma.task.update as jest.Mock).mockResolvedValue(out);
    const r = await service.markComplete(3);
    expect(r).toEqual(out);
    expect(prisma.task.update).toHaveBeenCalledWith(expect.objectContaining({ where: { id: 3 }, data: { completed: true } }));
  });
});
