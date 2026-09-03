import OpenAI from "openai";
import { noteTools } from "./tools.js";
import { noteServiceController } from "../services/note.services.js";
import { toolRegistry } from "./toolExecutor.js";

const client = new OpenAI({
  apiKey: process.env.TEAMOROUTER_API_KEY,
  baseURL: "https://api.teamorouter.com/v1",
});
const MAX_STEPS = 10;
export async function runAgent(userId: string, message: string) {
  let messages: any[] = [
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
  ];
  for (let step = 0; step < MAX_STEPS; step++) {
    const completion = await client.chat.completions.create({
      model: "glm-5.3-flash-free",
      messages,
      tools: noteTools.map((tool) => ({
        type: "function",
        function: tool,
      })),
    });
    const msg = completion.choices[0].message;
    messages.push(msg);
    const toolCalls = msg.tool_calls;
    if (!toolCalls || toolCalls.length === 0) {
      return msg.content;
    }
    for (const toolCall of toolCalls) {
      if (toolCall.type !== "function") {
        continue;
      }
      const toolName = toolCall.function.name;
      const args = JSON.parse(toolCall.function.arguments || "{}");
      const executor = toolRegistry[toolName];
      if (!executor) {
        throw new Error(`Unknown tool ${toolName}`);
      }
      const result = await executor(userId, args);
      messages.push({
        role: "tool",
        tool_call_id: toolCall.id,
        content: JSON.stringify(result),
      });
    }
  }
  throw new Error(`Agent exceeded max steps`);
  // while (true) {
  //   const completion = await client.chat.completions.create({
  //     model: "glm-5.3-flash-free",
  //     messages,
  //     tools: noteTools.map((tool) => ({
  //       type: "function",
  //       function: tool,
  //     })),
  //   });

  //   const msg = completion.choices[0].message;
  //   messages.push(msg);
  //   const toolCall = msg.tool_calls?.[0];
  //   if (!toolCall || toolCall.type !== "function") {
  //     return msg.content;
  //   }
  //   const { name, arguments: argsString } = toolCall.function;
  //   const args = JSON.parse(argsString);
  //   let result;
  //   switch (name) {
  //     case "create_note":
  //       result = await noteServiceController.create(userId, args.content);
  //       break;
  //     case "update_note":
  //       result = await noteServiceController.update(
  //         args.noteId,
  //         userId,
  //         args.content
  //       );
  //       break;
  //     case "complete_note":
  //       result = await noteServiceController.markCompleted(args.noteId, userId);
  //       break;
  //     case "search__completed_note":
  //       result = await noteServiceController.searchCompletedNote(userId);
  //       break;
  //     case "search__incompleted_note":
  //       result = await noteServiceController.searchInCompletedNote(userId);
  //       break;
  //     case "delete_note":
  //       result = await noteServiceController.delete(args.noteId, userId);
  //       if (result.count === 0) {
  //         result = {
  //           success: false,
  //           message: "No note found with that  id",
  //         };
  //       } else {
  //         result = {
  //           success: true,
  //           message: "Note deleted successfully",
  //         };
  //       }
  //       break;
  //     case "search_note":
  //       result = await noteServiceController.search(userId, args.query);
  //   }
  //   console.log(result);
  //   messages.push({
  //     role: "tool",
  //     tool_call_id: toolCall.id,
  //     content: JSON.stringify(result),
  //   });
  // }
}
