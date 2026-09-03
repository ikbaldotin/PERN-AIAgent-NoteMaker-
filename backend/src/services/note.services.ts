import { prisma } from "../lib/prisma.js";

export const noteServiceController = {
  async create(userId: string, content: string) {
    console.log({ content });
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
  async markCompleted(noteId: string, userId: string) {
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
  async searchCompletedNote(userId: string) {
    return await prisma.note.findMany({
      where: {
        userId,
        isCompleted: true,
      },
      select: {
        id: true,
        content: true,
        isCompleted: true,
      },
    });
  },
  async searchInCompletedNote(userId: string) {
    return await prisma.note.findMany({
      where: {
        userId,
        isCompleted: false,
      },
      select: {
        id: true,
        content: true,
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
  async search(userId: string, query: string) {
    return await prisma.note.findMany({
      where: {
        userId,
        content: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        content: true,
        isCompleted: true,
      },
    });
  },
};
