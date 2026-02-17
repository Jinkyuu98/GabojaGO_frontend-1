"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { clsx } from "clsx";

export default function ResultPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("일정");
  const [selectedDay, setSelectedDay] = useState(1);
  const [sheetHeight, setSheetHeight] = useState(478);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [maxHeight, setMaxHeight] = useState(800);
  const [minHeight] = useState(100);
  const sheetRef = useRef(null);

  // Define 3-tier snap heights
  const SNAPS = {
    LOW: 100,
    MID: 550, // Roughly 60-70% on many devices
    HIGH: 800,
  };

  const tabs = ["일정", "기록", "예산", "준비물", "동행자"];
  const days = ["1일차", "2일차", "3일차", "4일차", "5일차", "4일차"];

  // Mock schedule data
  const scheduleItems = [
    {
      id: 1,
      number: 1,
      name: "제주산방산탄산온천",
      time: "10:00",
      note: "김밥 사들고 아일랜드 가기",
    },
    { id: 2, number: 2, name: "카멜리아 힐", time: "12:00" },
    { id: 3, number: 3, name: "헬로키티아일랜드", time: "14:00" },
    {
      id: 4,
      number: 4,
      name: "헬로키티아일랜드",
      time: "14:00",
      note: "김밥 사들고 아일랜드 가기",
    },
  ];

  useEffect(() => {
    const h = window.innerHeight;
    const max = h * 0.95;
    const mid = h * 0.6;
    const min = 100;

    setMaxHeight(max);
    setSheetHeight(mid); // Start in Middle

    // Update SNAPS mapping
    SNAPS.LOW = min;
    SNAPS.MID = mid;
    SNAPS.HIGH = max;
  }, []);

  // Calculate sheet percentage (0-100%)
  const isCollapsed = sheetHeight <= SNAPS.LOW + 20;
  const isSheetPulledDown = isCollapsed;

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(sheetHeight);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const deltaY = e.touches[0].clientY - startY;
    const newHeight = Math.max(
      minHeight,
      Math.min(maxHeight, currentY - deltaY),
    );
    setSheetHeight(newHeight);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    const h = window.innerHeight;
    const snaps = [minHeight, h * 0.6, h * 0.95];

    // Find closest snap point
    const closest = snaps.reduce((prev, curr) => {
      return Math.abs(curr - sheetHeight) < Math.abs(prev - sheetHeight)
        ? curr
        : prev;
    });

    setSheetHeight(closest);
  };

  const handleSaveSchedule = () => {
    router.push("/intro?from=result_save&showClose=true");
  };

  return (
    <div className="relative w-full h-screen bg-white overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 w-full h-full">
        <Image
          src="/images/map-background.png"
          alt="map"
          fill
          className="object-cover"
          priority
        />

        {/* Map Markers */}
        <div className="absolute" style={{ top: "166px", left: "148px" }}>
          <div
            className={clsx(
              "rounded-full bg-[#7a28fa] text-white font-semibold flex items-center justify-center transition-all duration-300",
              isSheetPulledDown ? "w-12 h-12 text-xl" : "w-8 h-8 text-[15px]",
            )}
          >
            1
          </div>
        </div>
        <div className="absolute" style={{ top: "218px", left: "138px" }}>
          <div className="w-8 h-8 rounded-full bg-[#7a28fa] text-white text-[15px] font-semibold flex items-center justify-center">
            2
          </div>
        </div>
        <div className="absolute" style={{ top: "172px", left: "269px" }}>
          <div className="w-8 h-8 rounded-full bg-[#7a28fa] text-white text-[15px] font-semibold flex items-center justify-center">
            3
          </div>
        </div>

        {/* Header */}
        <div className="fixed top-0 left-0 right-0 px-6 pt-4 pb-4 flex items-center justify-between bg-white z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()}>
              <Image
                src="/icons/arrow-left.svg"
                alt="back"
                width={20}
                height={16}
                className="w-5 h-4"
              />
            </button>
            <h1 className="text-lg font-semibold text-[#111111] tracking-[-0.5px]">
              제주도 여행
            </h1>
          </div>
          <button className="text-sm font-medium text-[#111111]">
            챗봇 대화
          </button>
        </div>

        {/* Floating schedule info when sheet is pulled down */}
        {isSheetPulledDown && (
          <div
            className="absolute left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-lg px-4 py-3 transition-all duration-300 w-[90%]"
            style={{ bottom: `${sheetHeight + 20}px` }}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#7a28fa] text-white text-sm font-bold flex items-center justify-center">
                1
              </div>
              <div>
                <p className="text-base font-semibold text-[#111111] tracking-[-0.06px]">
                  제주산방산탄산온천
                </p>
                <p className="text-sm text-[#7a28fa] tracking-[-0.06px]">
                  10:00
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className="fixed left-0 right-0 bg-white rounded-t-xl shadow-[0px_-4px_12px_rgba(0,0,0,0.04)] transition-all z-20"
        style={{
          height: `${sheetHeight}px`,
          bottom: 0,
        }}
      >
        {/* Drag Handle */}
        <div
          className="pt-3 pb-2 cursor-grab active:cursor-grabbing"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto" />
        </div>

        {/* Tabs (일정, 기록, 예산...) - Hidden when collapsed */}
        {!isCollapsed && (
          <div className="border-b border-[#e5ebf2] px-5">
            <div className="flex items-center gap-4 pb-3">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={clsx(
                    "text-base font-semibold tracking-[-0.4px] pb-2 border-b-2 transition-colors",
                    selectedTab === tab
                      ? "text-[#111111] border-[#111111]"
                      : "text-[#898989] border-transparent",
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Day Tabs (1일차, 2일차...) - Always visible */}
        <div className="px-5 pt-4 pb-3 flex gap-1 overflow-x-auto scrollbar-hide">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(index + 1)}
              className={clsx(
                "px-4 py-2 rounded-full text-[15px] font-semibold whitespace-nowrap transition-colors",
                selectedDay === index + 1
                  ? "bg-[#111111] text-white"
                  : "bg-transparent text-black font-normal",
              )}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Content visible only when not collapsed (Schedule + Button) */}
        {!isCollapsed && (
          <>
            {/* Schedule List */}
            <div
              className="px-5 pb-24 overflow-y-auto"
              style={{ maxHeight: `${sheetHeight - 200}px` }}
            >
              <div className="flex flex-col gap-6">
                {scheduleItems.map((item, index) => (
                  <div key={item.id} className="flex items-start gap-3.5">
                    {/* Number with divider */}
                    <div className="flex flex-col items-center gap-2 pt-1">
                      <div className="w-6 h-6 rounded-full bg-[#7a28fa] text-white text-sm font-bold flex items-center justify-center">
                        {item.number}
                      </div>
                      {index < scheduleItems.length - 1 && (
                        <div className="w-[1px] h-5 bg-[rgba(229,235,241,0.7)]" />
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-5 mb-2">
                        <h3 className="text-base font-semibold text-[#111111] tracking-[-0.06px]">
                          {item.name}
                        </h3>
                        <Image
                          src="/icons/dots-menu.svg"
                          alt="menu"
                          width={18}
                          height={4}
                          className="flex-shrink-0"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-[#7a28fa] tracking-[-0.06px]">
                          {item.time}
                        </span>
                        {item.note && (
                          <span className="text-sm text-[#6e6e6e] tracking-[-0.06px]">
                            {item.note}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Button */}
            <div className="absolute bottom-0 left-0 right-0 p-5 bg-white z-30">
              <button
                onClick={handleSaveSchedule}
                className="w-full py-[14px] bg-[#111111] rounded-xl text-base font-semibold text-white tracking-[-0.06px]"
              >
                일정 저장 및 편집
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
