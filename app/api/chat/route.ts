import { OpenAI } from "openai";
import {
    OpenAIStream,
    StreamingTextResponse,
  } from "ai";
  import { functions, runFunction } from "./functions";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });


  export async function POST(req: Request) {
   
    const { messages } = await req.json();
  
    // check if the conversation requires a function call to be made
    const initialResponse = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-0613",
      messages,
      stream: true,
      functions,
      function_call: "auto",
    });
  
    const stream = OpenAIStream(initialResponse, {
      experimental_onFunctionCall: async (
        { name, arguments: args },
        createFunctionCallMessages,
      ) => {
        const result = await runFunction(name, args);
        const newMessages = createFunctionCallMessages(result);
        return openai.chat.completions.create({
          model: "gpt-3.5-turbo-0613",
          stream: true,
          messages: [...messages, ...newMessages],
        });
      },
    });
  
    return new StreamingTextResponse(stream);
  }