import axios from "axios"

export const createCall = (data: { phone: string; message: string }) => {
  return axios.post("https://consummatory-sherilyn-unlugubriously.ngrok-free.dev/call/create", data)
}

// export const voiceInitiate = async (message: string) => {
//   try {
//     const response = await axios.get(
//       "https://consummatory-sherilyn-unlugubriously.ngrok-free.dev/voice",
//       { params: { message } }
//     );
//     return response.data; 
//   } catch (err) {
//     console.error("Voice Initiate Error:", err);
//     throw err; 
//   }
// };


