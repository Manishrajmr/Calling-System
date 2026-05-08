import { useState } from "react"
import { createCall } from "../services/api"
import { Button } from "./ui/Button"
import { Input } from "./ui/Input"
import { Textarea } from "./ui/Textarea"
import { PhoneIcon } from "./icons/PhoneIcon"
import { CallStatus } from "./ui/CallStatus"

interface FormData {
  phone: string
  message: string
}

interface FormErrors {
  phone?: string
  message?: string
}

export default function CallForm() {
  const [formData, setFormData] = useState<FormData>({ phone: "", message: "" })
  const [errors, setErrors] = useState<FormErrors>({})
  const [callStatus, setCallStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [statusMessage, setStatusMessage] = useState("")

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^\+?[\d\s-]{10,}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Please enter a valid phone number"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 5) {
      newErrors.message = "Message must be at least 5 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setCallStatus("loading")
    setStatusMessage("Initiating your call...")

    try {
      await createCall({ phone: formData.phone, message: formData.message })
      setCallStatus("success")
      setStatusMessage("Call initiated successfully!")
      setFormData({ phone: "", message: "" })
      setTimeout(() => {
        setCallStatus("idle")
        setStatusMessage("")
      }, 3000)
    } catch (error) {
      setCallStatus("error")
      setStatusMessage("Failed to initiate call. Please try again.")
      setTimeout(() => {
        setCallStatus("idle")
        setStatusMessage("")
      }, 5000)
    }
  }

  const handleChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-lg">
        <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-5 sm:p-6 md:p-8">
          <h1 className="text-xl sm:text-2xl md:text-2xl font-bold text-gray-100 mb-4 sm:mb-6 flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 md:w-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <PhoneIcon className="w-5 h-5 sm:w-6 md:w-6 text-emerald-400" />
            </div>
            Make a Call
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
            <Input
              label="Phone Number"
              type="tel"
              placeholder="+91 98765 43210"
              value={formData.phone}
              onChange={handleChange("phone")}
              error={errors.phone}
              icon={<PhoneIcon className="w-5 h-5" />}
            />

            <Textarea
              label="Message"
              placeholder="Enter the message you want to convey..."
              value={formData.message}
              onChange={handleChange("message")}
              error={errors.message}
              rows={4}
            />

            {callStatus !== "idle" && (
              <CallStatus
                status={callStatus}
                message={statusMessage}
              />
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full text-base sm:text-base"
              disabled={callStatus === "loading"}
            >
              {callStatus === "loading" ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 sm:mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                <>
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  Initiate Call
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
