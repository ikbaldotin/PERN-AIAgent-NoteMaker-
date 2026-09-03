import { noteServiceController } from "../services/note.services.js";
import { ToolExecutor } from "../types/index.js";

async function resolveNoteId(userId: string, args: any) {
  if (args.noteId) return args.noteId;

  if (!args.query) return null;

  const results = await noteServiceController.search(userId, args.query);

  if (!results.length) return null;

  return results[0].id;
}

export const toolRegistry: Record<string, ToolExecutor> = {
  create_note: async (userId, args) => {
    return noteServiceController.create(userId, args.content);
  },

  search_notes: async (userId, args) => {
    return noteServiceController.search(userId, args.query);
  },

  search_completed_notes: async (userId) => {
    return noteServiceController.searchCompletedNote(userId);
  },

  search_incompleted_notes: async (userId) => {
    return noteServiceController.searchInCompletedNote(userId);
  },

  update_note: async (userId, args) => {
    const noteId = await resolveNoteId(userId, args);
    if (!noteId) {
      return { success: false, message: "Note not found" };
    }
    return noteServiceController.update(noteId, userId, args.content);
  },

  complete_note: async (userId, args) => {
    const noteId = await resolveNoteId(userId, args);
    if (!noteId) {
      return { success: false, message: "Note not found" };
    }
    return noteServiceController.markCompleted(noteId, userId);
  },

  delete_note: async (userId, args) => {
    const noteId = await resolveNoteId(userId, args);
    if (!noteId) {
      return { success: false, message: "Note not found" };
    }
    return await noteServiceController.delete(noteId, userId);
  },
};
