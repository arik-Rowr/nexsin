/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { Verified } from "lucide-react"
import { useRef, useState, useCallback } from "react"
import Webcam from "react-webcam"

interface Props {
  onComplete: (success: boolean) => void
  attempts: number
}

const API = process.env.NEXT_PUBLIC_BACKEND_URL

export default function FaceVerificationStep({ onComplete, attempts }: Props) {
  const webcamRef = useRef<Webcam>(null)

  const [status, setStatus] = useState<"idle" | "scanning" | "success" | "failed">("idle")
  const [instruction, setInstruction] = useState("Position your face in the circle")
  const [blinkCount, setBlinkCount] = useState(0)

  const framesRef = useRef<string[]>([])
  const processingRef = useRef(false)

  // 🔥 CAPTURE FRAMES
  const startFrameCapture = () => {
    framesRef.current = []

    const interval = setInterval(() => {
      const frame = webcamRef.current?.getScreenshot()
      if (frame && framesRef.current.length < 30) {
        framesRef.current.push(frame)
      }
    }, 200) // capture every 200ms

    return interval
  }

  // 🔥 MAIN FLOW
  const simulateBlinkDetection = useCallback(() => {
    if (processingRef.current) return
    processingRef.current = true

    setStatus("scanning")
    setInstruction("Please blink 2-3 times naturally...")

    let count = 0

    const frameInterval = startFrameCapture()

    const interval = setInterval(async () => {
      count++
      setBlinkCount(count)

      if (count >= 3) {
        clearInterval(interval)
        clearInterval(frameInterval)

        try {
          // ✅ Check frames
          if (framesRef.current.length < 5) {
            throw new Error("Not enough frames captured")
          }

          // 🔥 VERIFY LIVENESS
          const verifyRes = await fetch(`${API}/api/provider/verify-liveness`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              frames: framesRef.current,
            }),
          })

          const verifyData = await verifyRes.json()

          if (!verifyData.verified) {
            throw new Error("Liveness verification failed")
          }

          // 🔥 CAPTURE FINAL IMAGE
          const finalImage = webcamRef.current?.getScreenshot()
          if (!finalImage) throw new Error("Failed to capture image")

          // 🔥 SAVE FACE (backend uploads to cloudinary)
          const saveRes = await fetch(`${API}/api/provider/save-face`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              image: finalImage,
              liveness_verified: true,
            }),
          })

          if (!saveRes.ok) {
            throw new Error("Failed to save face")
          }

          // ✅ SUCCESS
          setStatus("success")
          setInstruction("Face verified successfully ✓")

          setTimeout(() => onComplete(true), 1500)
        } catch (err: any) {
          console.error(err)

          setStatus("failed")
          setInstruction(err.message || "Verification failed")

          processingRef.current = false
        }
      }
    }, 800)
  }, [onComplete])

  return (
    <div className="max-w-md mx-auto text-center">
      <h2 className="text-2xl font-semibold mb-2">Identity Verification</h2>
      <p className="text-gray-600 mb-8">
        We need to verify you are a real person. This helps maintain trust on our platform.
      </p>

      <div className="relative mx-auto w-80 h-80 rounded-full overflow-hidden border-8 border-white shadow-2xl bg-black">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/jpeg"
          className="w-full h-full object-cover"
          videoConstraints={{ facingMode: "user" }}
        />

        {/* Overlay Circle */}
        <div className="absolute inset-0 border-4 border-dashed border-white/70 rounded-full" />
      </div>

      <div className="mt-8 space-y-4">
        <p className="font-medium text-lg text-gray-800">{instruction}</p>

        {status === "idle" && (
          <button
            onClick={simulateBlinkDetection}
            className="px-10 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-semibold text-lg transition-all active:scale-95"
          >
            Start Face Verification
          </button>
        )}

        {status === "scanning" && (
          <div className="flex justify-center items-center gap-3 text-blue-600">
            <div className="animate-spin h-5 w-5 border-2 border-current border-t-transparent rounded-full" />
            <span>Detecting liveness...</span>
          </div>
        )}

        {status === "success" && (
          <div className="text-emerald-600 font-semibold text-xl"> <Verified/> Verified</div>
        )}

        {status === "failed" && (
          <button
            onClick={() => {
              setStatus("idle")
              setBlinkCount(0)
              processingRef.current = false
            }}
            className="px-6 py-2 bg-gray-200 rounded-lg"
          >
            Retry
          </button>
        )}

        {attempts > 0 && status !== "success" && (
          <p className="text-amber-600 text-sm">Attempt {attempts}/3 • Try to blink naturally</p>
        )}
      </div>
    </div>
  )
}