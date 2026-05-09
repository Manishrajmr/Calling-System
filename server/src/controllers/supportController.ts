import { supportService } from "../services/supportService.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

console.log("Support Controller Logic Loading...");

export const getTopics = async (req: any, res: any) => {
    try {
        const data = await supportService.getTopics();
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const getQueriesByTopic = async (req: any, res: any) => {
    try {
        const data = await supportService.getQueriesByTopic(req.params.topicId);
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const createQuery = async (req: any, res: any) => {
    try {
        const { topicId, question, answer } = req.body;
        const data = await supportService.createQuery(topicId, question, answer);
        res.status(201).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const searchQueries = async (req: any, res: any) => {
    try {
        const q = typeof req.query.q === "string" ? req.query.q : "";
        const data = await supportService.searchQueries(q);
        res.json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const bulkCreate = async (req: any, res: any) => {
    try {
        const { topicName, items } = req.body;
        const data = await supportService.bulkCreate(topicName, items);
        res.status(201).json(data);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

export const importManual = async (req: any, res: any) => {
    try {
        if (!req.file) return res.status(400).json({ error: "No file uploaded" });

        // Load pdf-parse inside the function to avoid startup crashes
        const PDFParse = require("pdf-parse");
        const result = await PDFParse(req.file.buffer);
        const extractedText = result.text;


        if (!extractedText) {
            throw new Error("No text could be extracted from the PDF");
        }

        console.log("PDF text extracted, length:", extractedText.length);
        const parseResult = await supportService.parseAndStorePDF(extractedText);

        res.json({ message: "Import successful", ...parseResult });
    } catch (error: any) {
        console.error("PDF Parsing error:", error);
        res.status(500).json({ error: error.message || "Failed to parse PDF" });
    }
};
