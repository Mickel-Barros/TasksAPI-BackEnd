import prisma from "../db/prismaClient";

export async function listTasks(page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  return prisma.task.findMany({
    where: { deletedAt: null },
    skip,
    take: limit,
    orderBy: { createdAt: "desc" },
  });
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
  return prisma.task.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}

export async function markComplete(id: number) {
  return prisma.task.update({
    where: { id },
    data: { completed: true },
  });
}

export async function updateTask(id: number, data: { title?: string; description?: string }) {
  return prisma.task.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
    },
  });
}
