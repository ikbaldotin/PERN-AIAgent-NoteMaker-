export const noteTools = [
  {
    name: "create_note",
    description: "Create a new note",
    parameters: {
      type: "object",
      properties: {
        content: {
          type: "string",
        },
      },
      required: ["content"],
    },
  },
  {
    name: "update_note",
    description: "Update an existing note",
    parameters: {
      type: "object",
      properties: {
        noteId: {
          type: "string",
        },
        query: { type: "string" },
        content: { type: "string" },
      },
      required: ["content"],
    },
  },
  {
    name: "search_note",
    description: "Search notes by content to find note IDS",
    parameters: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Text to search the notes",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "search__completed_note",
    description: "Get completed note",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "search__incompleted_note",
    description: "Get incompleted note",
    parameters: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "complete_note",
    description: "Mark the note  completed",
    parameters: {
      type: "object",
      properties: {
        noteId: {
          type: "string",
        },
      },
      required: ["noteId"],
    },
  },
  {
    name: "delete_note",
    description: "Delete a note",
    parameters: {
      type: "object",
      properties: {
        noteId: {
          type: "string",
        },
        query: { type: "string" },
      },
      required: ["noteId"],
    },
  },
];
