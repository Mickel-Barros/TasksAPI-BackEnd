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

export async function deleteTask(id: number) {
  await prisma.task.delete({ where: { id } });
}

export async function markComplete(id: number) {
  return prisma.task.update({
    where: { id },
    data: { completed: true },
  });
}
