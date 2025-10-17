import prisma from "../db/prismaClient";

export async function listTasks() {
  return prisma.task.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createTask(data: { title: string; description?: string }) {
  return prisma.task.create({
    data: {
      title: data.title,
      description: data.description ?? null,
    },
  });
}