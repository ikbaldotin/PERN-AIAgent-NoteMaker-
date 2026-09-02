import OpenAI from "openai";
import { noteTools } from "./tools.js";
import { noteServiceController } from "../services/note.services.js";

const client = new OpenAI({
  apiKey: process.env.TEAMOROUTER_API_KEY,
  baseURL: "https://api.teamorouter.com/v1",
});

export async function runAgent(userId: string, message: string) {
  const completion = await client.chat.completions.create({
    model: "glm-5.3-flash-free",
    messages: [
      {
        role: "system",
        content: `You are a note management AI.
            Rules:
                - NEVER create a note unless explicitly asked.
                - When searching notes, extract ONLY the core note text.
                - Remove pronouns and tense changes.

                Examples:
                User: "I woke up at 5am"
                Search query: "wake up at 5am"

                User: "I finished reading"
                Search query: "reading"

                Always normalize before searching.`,
      },
      {
        role: "user",
        content: message,
      },
    ],
    tools: noteTools.map((tool) => ({
      type: "function",
      function: tool,
    })),
  });
  const toolCall = completion.choices[0].message.tool_calls?.[0];
  if (!toolCall || toolCall.type !== "function") {
    return completion.choices[0].message.content;
  }
  const { name, arguments: argsString } = toolCall.function;
  const args = JSON.parse(argsString);
  switch (toolCall.function.name) {
    case "create_note":
      return noteServiceController.create(userId, args.content);
    case "update_note":
      return noteServiceController.update(args.noteId, userId, args.content);
    case "compelete_note":
      return noteServiceController.markCompeleted(args.noteId, userId);
    case "delete_note":
      return noteServiceController.delete(args.noteId, userId);
  }
}
