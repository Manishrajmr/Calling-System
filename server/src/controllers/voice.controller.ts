import { Request, Response } from "express"
import { generateVoiceXML } from "../utils/xmlBuilder.js"

export const voiceHandler = (req: Request, res: Response) => {
  const message = req.query.message as string;

  console.log(message);

  const xml = generateVoiceXML(message);

  res.set("Content-Type", "text/xml")
  res.send(xml)
}