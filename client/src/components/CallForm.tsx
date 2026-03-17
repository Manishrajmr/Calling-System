import { useState } from "react"
import { createCall } from "../services/api"

export default function CallForm() {
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")

 const handleCall = async () => {
  try {
    await createCall({ phone, message });
    alert("📞 Call Initiated");

    // // Trigger the voice XML on backend
    // await voiceInitiate(message);
    // console.log("Voice message triggered successfully");
  } catch (error) {
    console.error("Error initiating call or voice:", error);
    alert("❌ Failed to initiate call or voice");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
  <div className="w-full max-w-md bg-gray-700 rounded-2xl shadow-lg p-6 space-y-5">
    
    <h2 className="text-2xl font-semibold text-gray-800 text-center">
      Call System
    </h2>

    <input
      type="text"
      placeholder="Enter Phone Number"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />

    <textarea
      placeholder="Enter Message"
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      rows={4}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />

    <button
      onClick={handleCall}
      className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
    >
      Create Call
    </button>

  </div>
</div>
  )
}