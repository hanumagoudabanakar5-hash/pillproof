"use client";

import { useEffect, useRef, useState } from "react";

interface QRScannerProps {
  onResult: (text: string) => void;
  onError?: (error: string) => void;
}

export default function QRScanner({ onResult, onError }: QRScannerProps) {
  const regionId = "qr-reader-region";
  const scannerRef = useRef<unknown>(null);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startScanner() {
    try {
      // Dynamically import to avoid SSR issues
      const { Html5QrcodeScanner } = await import("html5-qrcode");
      const scanner = new Html5QrcodeScanner(
        regionId,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      scanner.render(
        (decodedText: string) => {
          onResult(decodedText);
          scanner.clear().catch(() => {});
          setStarted(false);
        },
        (errorMsg: string) => {
          // Ignore scan errors (they fire continuously when no QR is visible)
          if (onError && !errorMsg.includes("No MultiFormat Readers")) {
            onError(errorMsg);
          }
        }
      );
      scannerRef.current = scanner;
      setStarted(true);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Camera access failed";
      setError(msg);
      if (onError) onError(msg);
    }
  }

  function stopScanner() {
    if (scannerRef.current) {
      (scannerRef.current as { clear: () => Promise<void> })
        .clear()
        .catch(() => {});
      scannerRef.current = null;
    }
    setStarted(false);
  }

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  return (
    <div className="flex flex-col items-center gap-4">
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}

      <div id={regionId} className="w-full max-w-sm" />

      {!started ? (
        <button
          onClick={startScanner}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          📷 Start Camera Scanner
        </button>
      ) : (
        <button
          onClick={stopScanner}
          className="px-5 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg text-sm font-medium transition-colors"
        >
          ⏹ Stop Scanner
        </button>
      )}

      <p className="text-xs text-zinc-500 dark:text-zinc-400 text-center max-w-xs">
        Point the camera at a PillProof QR code, or enter the batch ID manually below.
      </p>
    </div>
  );
}
