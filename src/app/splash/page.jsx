"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SplashPage() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/intro");
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div
      className="flex min-h-screen w-full items-center justify-center"
      style={{ backgroundColor: "#000000" }}
    >
      <div
        className="relative h-[812px] w-full max-w-[375px]"
        style={{ backgroundColor: "#111111" }}
      >
        {/* Traveler Character Image - positioned at y: 234px from container top */}
        <div
          style={{
            position: "absolute",
            left: "99px",
            top: "234px",
            width: "197px",
            height: "259px",
          }}
        >
          <Image
            src="/traveler-character.png"
            alt="Traveler"
            width={197}
            height={259}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>

        {/* Logo Text - positioned at y: 491px from container top */}
        <h1
          style={{
            position: "absolute",
            left: "114px",
            top: "491px",
            fontFamily: "Pretendard Variable, Pretendard, sans-serif",
            fontSize: "36px",
            fontWeight: 800,
            letterSpacing: "-0.8px",
            lineHeight: "50px",
            color: "#ffffff",
            margin: 0,
          }}
        >
          가보자GO
        </h1>
      </div>
    </div>
  );
}
