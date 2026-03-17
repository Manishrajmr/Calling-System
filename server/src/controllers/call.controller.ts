import { Request, Response } from "express"
import { makeCall } from "../services/vobiz.service.js"

export const createCall = async (req: Request, res: Response) => {
  try {
    const { phone, message } = req.body

    if (!phone || !message) {
      return res.status(400).json({ message: "Phone & message required" })
    }

    const result = await makeCall(phone, message)

    res.json({
      success: true,
      data: result
    })
  } catch (err: any) {
    res.status(500).json({ error: err.message })
  }
}