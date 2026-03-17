import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

export const makeCall = async (phone: string, message: string) => {
  const url = process.env.VOBIZ_CALL_URL!;

  try {
    const response = await axios.post(
      url,
      {
        from: process.env.VOBIZ_CALLER_ID,
        to: phone,
        answer_url: `https://consummatory-sherilyn-unlugubriously.ngrok-free.dev/voice?message=${encodeURIComponent(message)}`,
        answer_method: "POST",
      },
      {
        headers: {
          "X-Auth-ID": process.env.VOBIZ_AUTH_ID!,
          "X-Auth-Token": process.env.VOBIZ_AUTH_TOKEN!,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("FULL ERROR:", error.response?.data || error.message);
    throw error;
  }
};
