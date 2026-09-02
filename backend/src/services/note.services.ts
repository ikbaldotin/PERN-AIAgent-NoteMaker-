import { prisma } from "../lib/prisma.js";

export const noteServiceController = {
  async create(userId: string, content: string) {
    return await prisma.note.create({
      data: {
        userId,
        content,
      },
    });
  },
  async update(noteId: string, userId: string, content: string) {
    return await prisma.note.updateMany({
      where: {
        id: noteId,
        userId,
      },
      data: {
        content,
      },
    });
  },
  async markCompeleted(noteId: string, userId: string) {
    return await prisma.note.updateMany({
      where: {
        id: noteId,
        userId,
      },
      data: {
        isCompleted: true,
      },
    });
  },
  async delete(noteId: string, userId: string) {
    return await prisma.note.deleteMany({
      where: {
        id: noteId,
        userId,
      },
    });
  },
  async getAll(userId: string) {
    return await prisma.note.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};
