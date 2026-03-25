import axios from "axios"

export const createCall = (data: { phone: string; message: string }) => {
  return axios.post("https://consummatory-sherilyn-unlugubriously.ngrok-free.dev/call/create", data)
}




