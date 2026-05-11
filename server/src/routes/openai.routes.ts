import express from "express"
import { getAIResponse } from "../controllers/openai.controller.js"

const router = express.Router()

router.post("/chat/completions", getAIResponse)

export default router
