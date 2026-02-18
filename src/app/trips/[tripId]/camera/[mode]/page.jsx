"use client";

import React, { useRef, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Camera,
  RefreshCw,
  X,
  Check,
  Save,
  Image as ImageIcon,
} from "lucide-react";
import { MobileContainer } from "../../../../../components/layout/MobileContainer";

export default function TravelCameraPage() {
  const params = useParams();
  const { tripId, mode } = params;
  const router = useRouter();

  const isReceipt = mode === "receipt";

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let currentStream = null;

    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });

        currentStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current
              .play()
              .catch((e) => console.error("Video play failed:", e));
          };
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError("카메라 접근에 실패했습니다. (권한 및 카메라 상태 확인)");
      }
    };

    if (!capturedImage) {
      startCamera();
    }

    return () => {
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [capturedImage]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      const context = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageData);

      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        setStream(null);
      }
    }
  };

  const handleAlbumClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
        if (stream) {
          stream.getTracks().forEach((track) => track.stop());
          setStream(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const handleSave = () => {
    console.log(`Saving ${mode} for trip:`, tripId);
    alert(isReceipt ? "영수증이 등록되었습니다!" : "사진이 저장되었습니다!");
    router.push(`/trips/${tripId}`);
  };

  return (
    <MobileContainer>
      <div className="h-full bg-black relative flex flex-col">
        {/* Header */}
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-20 text-white bg-gradient-to-b from-black/60 to-transparent">
          <button
            className="bg-transparent border-none text-white cursor-pointer p-2 rounded-full hover:bg-white/10"
            onClick={() => router.back()}
          >
            <X size={24} />
          </button>
          <h2 className="text-lg font-bold">
            {isReceipt ? "영수증 촬영" : "사진 촬영"}
          </h2>
          <div className="w-6" /> {/* Spacer */}
        </div>

        {/* Camera View / Preview */}
        <div className="flex-1 relative flex items-center justify-center overflow-hidden bg-black">
          {error ? (
            <div className="text-white text-center p-4">{error}</div>
          ) : capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured"
              className="w-full h-full object-contain"
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          )}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>

        {/* Controls */}
        <div className="bg-black pb-8 pt-6 px-6 flex justify-between items-center z-20">
          {capturedImage ? (
            <>
              <button
                className="flex flex-col items-center gap-1 text-white bg-transparent border-none cursor-pointer p-2"
                onClick={handleRetake}
              >
                <RefreshCw size={24} />
                <span className="text-xs">다시 찍기</span>
              </button>
              <button
                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold border-none"
                onClick={handleSave}
              >
                <Save size={20} />
                <span>저장하기</span>
              </button>
            </>
          ) : (
            <div className="w-full flex justify-between items-center">
              {isReceipt ? (
                <button
                  className="w-20 text-white text-sm font-medium bg-transparent border-none cursor-pointer"
                  onClick={() => alert("직접 입력 페이지로 이동합니다.")}
                >
                  직접 입력
                </button>
              ) : (
                <div className="w-20" />
              )}

              <button
                className="w-20 h-20 rounded-full border-[5px] border-white flex items-center justify-center bg-transparent cursor-pointer active:scale-95 transition-transform"
                onClick={handleCapture}
                disabled={!!error}
              >
                <div className="w-16 h-16 rounded-full bg-white transition-opacity hover:opacity-90" />
              </button>

              <button
                className="w-20 h-20 flex flex-col items-center justify-center gap-1 bg-transparent border-none cursor-pointer text-white"
                onClick={handleAlbumClick}
                title="앨범에서 선택"
              >
                <ImageIcon size={24} />
                <span className="text-[10px] font-medium">불러오기</span>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  style={{ display: "none" }}
                />
              </button>
            </div>
          )}
        </div>
      </div>
    </MobileContainer>
  );
}
