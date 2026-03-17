import express from "express"
import { voiceHandler } from "../controllers/voice.controller.js"

const router = express.Router();

router.post("/", voiceHandler)

export default router