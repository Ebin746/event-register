"use client";
import { useEffect, useRef, useState } from "react";
import { Camera, XCircle } from "lucide-react";
import jsQR from "jsqr";

interface QRScannerProps {
  onScan: (ticketId: string) => void;
  onClose: () => void;
}

export default function QRScanner({ onScan, onClose }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState("");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationFrame: number | undefined;

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" }
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;

          // Wait for video metadata to load before playing
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().then(() => {
              setScanning(true);
              scanQRCode();
            }).catch(err => {
              console.error("Video play error:", err);
              setError("Unable to start camera preview.");
            });
          };
        }
      } catch (err) {
        setError("Unable to access camera. Please check permissions.");
        console.error("Camera error:", err);
      }
    };

    const scanQRCode = () => {
      if (!videoRef.current || !canvasRef.current) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (!context || video.readyState !== video.HAVE_ENOUGH_DATA) {
        animationFrame = requestAnimationFrame(scanQRCode);
        return;
      }

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      try {
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code && code.data) {
          console.log("QR Code detected:", code.data);
          onScan(code.data);
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
          }
          return;
        }
      } catch (err) {
        console.error("QR scan error:", err);
      }

      animationFrame = requestAnimationFrame(scanQRCode);
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [onScan]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <XCircle className="w-8 h-8" />
        </button>

        <div className="bg-white rounded-2xl p-6">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Scan QR Code</h3>
            <p className="text-sm text-gray-600">Position the QR code within the frame</p>
          </div>

          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {error}
            </div>
          ) : (
            <div className="relative">
              <video
                ref={videoRef}
                className="w-full rounded-lg"
                playsInline
                muted
              />
              <canvas ref={canvasRef} className="hidden" />

              {/* Scanning overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-64 h-64 border-4 border-green-500 rounded-lg">
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white"></div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              {scanning ? "Scanning for QR codes..." : "Initializing camera..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}