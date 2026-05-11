import OpenAI from "openai";

// Extract text safely
export function extractText(
  response: OpenAI.Responses.Response
): string {
  return response.output_text || "";
}

//  Extract usage safely
export function extractUsage(
  response: OpenAI.Responses.Response
) {
  return response.usage || {
    input_tokens: 0,
    output_tokens: 0,
    total_tokens: 0,
  };
}

//  (Optional) Structured log
export function logAIResponse(
  response: OpenAI.Responses.Response
) {
  console.log("AI Reply:", response.output_text);
  console.log("Usage:", response.usage);
}