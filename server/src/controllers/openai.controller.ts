import { Request, Response } from "express";
import { generateResponse } from "../services/openai.js";
import {
  extractText,
  extractUsage,
  logAIResponse,
} from "../utils/openaiResponse.js";

export const getAIResponse = async (req: Request, res: Response) => {
  try {
    const message = req.body?.message;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required",
      });
    }

    const aiResponse = await generateResponse(message);

    const reply = extractText(aiResponse);
    const usage = extractUsage(aiResponse);

    logAIResponse(aiResponse);

    return res.json({
      success: true,
      reply,
      usage,
    });

  } catch (error) {
    console.error("Error:", error);

    return res.status(500).json({
      success: false,
      error: "Something went wrong",
    });
  }
};