"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MobileContainer } from "../../components/layout/MobileContainer";
import { BottomNavigation } from "../../components/layout/BottomNavigation";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { Search, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

const TripCard = ({ trip, onClick, index }) => {
  const accentColors = [
    "#34C759", // Apple Green
    "#007AFF", // Apple Blue
    "#FF9500", // Apple Orange
    "#AF52DE", // Apple Purple
    "#FF2D55", // Apple Pink
    "#5856D6", // Apple Indigo
  ];

  const accentColor = accentColors[index % accentColors.length];

  return (
    <div
      className="bg-white rounded-[20px] flex overflow-hidden shadow-sm cursor-pointer border border-black/5 transition-all active:scale-[0.97]"
      onClick={onClick}
    >
      <div className="w-1.5 h-auto" style={{ backgroundColor: accentColor }} />
      <div className="flex-1 p-5 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[11px] font-bold text-[#8e8e93] px-2 py-0.5 bg-[#f2f2f7] rounded-md">
            {trip.companion || "나홀로"}
          </span>
          <span className="text-xs font-medium text-[#aeaeb2]">
            {trip.startDate ? trip.startDate.replace(/-/g, ".") : "날짜 없음"}
          </span>
        </div>
        <h2 className="text-lg font-bold mb-3 text-[#111] leading-tight">
          {trip.title}
        </h2>
        <div className="flex flex-wrap gap-1.5">
          {(trip.tags || ["🌿 자연", "☕️ 카페"]).map((tag, i) => (
            <span
              key={i}
              className="bg-[#f8f8f8] border border-[#f0f0f0] px-2.5 py-1 rounded-[10px] text-[11px] font-medium text-[#636366]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="flex items-center pr-3">
        <ChevronRight size={18} color="#C7C7CC" />
      </div>
    </div>
  );
};

export default function TripsListPage() {
  const router = useRouter();
  const { myTrips, resetTravelData } = useOnboardingStore();
  const [activeTab, setActiveTab] = useState("itinerary"); // 'itinerary' | 'records'

  const handleCreateNew = () => {
    resetTravelData();
    router.push("/onboarding/location");
  };

  const now = new Date();

  const itineraryTrips = myTrips
    .filter((trip) => {
      if (!trip.endDate) return true;
      return new Date(trip.endDate) >= now;
    })
    .reverse();

  const recordTrips = myTrips
    .filter((trip) => {
      if (!trip.endDate) return false;
      return new Date(trip.endDate) < now;
    })
    .reverse();

  const displayTrips = activeTab === "itinerary" ? itineraryTrips : recordTrips;

  return (
    <MobileContainer>
      <div className="h-full bg-[#f2f2f7] text-[#111] flex flex-col">
        <header className="flex items-center justify-between px-5 py-4 bg-[#f2f2f7]/80 backdrop-blur-md sticky top-0 z-10">
          <h1 className="text-[22px] font-extrabold text-[#111] tracking-tighter">
            여행 일정
          </h1>
          <button
            className="bg-transparent border-none text-[#111] flex items-center justify-center p-2 cursor-pointer rounded-full"
            onClick={() => console.log("Search clicked")}
          >
            <Search size={22} />
          </button>
        </header>

        <div className="px-5 py-2 bg-[#f2f2f7]/80 backdrop-blur-md sticky top-[60px] z-[9]">
          <div className="flex bg-[#e5e5ea] rounded-[10px] p-0.5 gap-0.5">
            <button
              className={clsx(
                "flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-all",
                {
                  "bg-white text-[#111] shadow-sm": activeTab === "itinerary",
                  "text-[#8e8e93]": activeTab !== "itinerary",
                },
              )}
              onClick={() => setActiveTab("itinerary")}
            >
              여정
            </button>
            <button
              className={clsx(
                "flex-1 py-1.5 text-[13px] font-bold rounded-lg transition-all",
                {
                  "bg-white text-[#111] shadow-sm": activeTab === "records",
                  "text-[#8e8e93]": activeTab !== "records",
                },
              )}
              onClick={() => setActiveTab("records")}
            >
              기록
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 pb-[100px] scrollbar-hide">
          {displayTrips.length > 0 ? (
            <div className="flex flex-col gap-4">
              {displayTrips.map((trip, index) => (
                <TripCard
                  key={trip.id}
                  trip={trip}
                  index={index}
                  onClick={() => router.push(`/trips/${trip.id}`)}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl py-16 px-5 text-center mt-5 shadow-sm">
              <p className="text-[15px] text-[#8e8e93] leading-relaxed mb-6 whitespace-pre-wrap">
                {activeTab === "itinerary"
                  ? "예정된 여정이 없습니다.\n새로운 여행을 계획해보세요!"
                  : "완료된 여행 기록이 없습니다."}
              </p>
              {activeTab === "itinerary" && (
                <button
                  className="bg-[#111] text-white border-none py-3.5 px-6 rounded-2xl font-bold text-[15px] cursor-pointer hover:opacity-90 active:opacity-80 transition-opacity"
                  onClick={handleCreateNew}
                >
                  AI 일정 생성하기
                </button>
              )}
            </div>
          )}
        </div>

        <BottomNavigation />
      </div>
    </MobileContainer>
  );
}
