import express from "express";
import { createCall } from "../controllers/call.controller.js"
const router = express.Router();

router.post("/create", createCall)

export default router