import OpenAI from "openai";
import "dotenv/config"

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// generate response function
  export async function generateResponse(message: string): Promise<OpenAI.Responses.Response> {
    // const response = await client.chat.completions.create({
    //   model: "gpt-4o-mini",
    //   messages: [
    //     { role: "user", content: message }
    //   ],
    // });

  const response = await client.responses.create({
      model: "gpt-5.4",
      input: message
  });

    return response
  }

