"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { MobileContainer } from "../../components/layout/MobileContainer";
import { BottomNavigation } from "../../components/layout/BottomNavigation";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { Search } from "lucide-react";
import { clsx } from "clsx";

const TripCard = ({ trip, onClick, isLast }) => {
  const companionText = trip.companion
    ? ["친구와", "연인과", "가족과", "부모님과"].includes(trip.companion)
      ? `${trip.companion} 함께`
      : trip.companion
    : "나홀로";

  const dateText = (() => {
    if (!trip.startDate) return "날짜 없음";
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      return dateStr.split("T")[0].replace(/-/g, ".");
    };
    const start = formatDate(trip.startDate);
    if (!trip.endDate) return start;
    const end = formatDate(trip.endDate);
    const startYear = start.split(".")[0];
    const endYear = end.split(".")[0];
    if (startYear === endYear) {
      return `${start} ~ ${end.substring(5)}`;
    } else {
      return `${start} ~ ${end}`;
    }
  })();

  const tags = trip.tags || ["자연", "맛집", "카페", "쇼핑"];

  return (
    <>
      <div
        className="px-4 py-4 lg:px-6 lg:py-5 cursor-pointer transition-colors h-full flex flex-col justify-center"
        onClick={onClick}
      >
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4 w-full">
          <div className="flex justify-between items-center gap-5 lg:w-auto shrink-0">
            <span className="text-[13px] font-medium text-[#7a28fa] bg-[#f8f6ff] px-2 py-1 rounded-[6px] tracking-[-0.5px] whitespace-nowrap transition-colors">
              {companionText}
            </span>
            <span className="text-[14px] font-normal text-[#969696] tracking-[-0.5px] whitespace-nowrap lg:hidden">
              {dateText}
            </span>
          </div>

          <h2 className="text-[18px] lg:text-[16px] font-bold text-[#111111] tracking-[-0.5px] leading-tight mb-auto lg:mb-0 lg:flex-1 truncate">
            {trip.title}
          </h2>

          <div className="flex flex-wrap gap-1.5 mt-1 lg:mt-0 lg:ml-2 shrink-0">
            {tags.map((tag, i) => {
              // 정규식을 이용하여 태그 안의 이모지 제거 (ex: "🚗 쇼핑" -> "쇼핑")
              const cleanTag = tag
                .replace(
                  /[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g,
                  "",
                )
                .trim();
              return (
                <span
                  key={i}
                  className="text-[12px] font-medium text-[#6e6e6e] bg-[#f2f4f6] px-2.5 py-1 rounded-md tracking-[-0.3px]"
                >
                  {cleanTag}
                </span>
              );
            })}
          </div>

          <span className="hidden lg:block text-[14px] font-normal text-[#969696] tracking-[-0.5px] whitespace-nowrap lg:shrink-0 lg:ml-auto">
            {dateText}
          </span>
        </div>
      </div>
      {!isLast && (
        <div className="h-[1px] mx-5 bg-[rgba(229,235,241,0.7)] md:hidden" />
      )}
    </>
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
    <MobileContainer showNav={true}>
      <div className="w-full h-screen bg-white flex flex-col lg:bg-[#f8f9fa]">
        <header className="flex items-center justify-between py-4 bg-white sticky top-0 z-10 lg:bg-transparent lg:border-none lg:py-6">
          <div className="max-w-[1280px] w-full mx-auto flex items-center justify-between px-5 lg:px-10">
            <h1 className="text-[20px] lg:text-[24px] font-semibold text-[#111] tracking-tighter">
              여행 일정
            </h1>
            <button
              className="bg-transparent border-none text-[#111] flex items-center justify-center p-2 cursor-pointer rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => console.log("Search clicked")}
            >
              <Search size={24} strokeWidth={2} />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto w-full pb-32">
          <div className="max-w-[1280px] w-full mx-auto lg:px-10">
            <div className="flex border-b border-[#f2f4f6] bg-white lg:mt-2 lg:rounded-t-2xl lg:px-8 lg:border-x lg:border-t lg:border-[#eceff4]">
              <button
                className={clsx(
                  "flex-1 py-4 text-[16px] tracking-[-0.3px] transition-all relative lg:text-[18px] lg:py-6",
                  activeTab === "itinerary"
                    ? "font-semibold text-[#111111]"
                    : "font-medium text-[#abb1b9]",
                )}
                onClick={() => setActiveTab("itinerary")}
              >
                일정
                {activeTab === "itinerary" && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#111111]" />
                )}
              </button>
              <button
                className={clsx(
                  "flex-1 py-4 text-[16px] tracking-[-0.3px] transition-all relative lg:text-[18px] lg:py-6",
                  activeTab === "records"
                    ? "font-semibold text-[#111111]"
                    : "font-medium text-[#abb1b9]",
                )}
                onClick={() => setActiveTab("records")}
              >
                기록
                {activeTab === "records" && (
                  <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[#111111]" />
                )}
              </button>
            </div>

            <div className="bg-[#fafafa] lg:bg-white px-5 py-5 lg:py-8 lg:rounded-b-2xl lg:px-8 min-h-[700px] lg:border lg:border-[#eceff4]">
              {displayTrips.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 xl:grid-cols-1 gap-3 lg:gap-4">
                  {displayTrips.map((trip, index) => (
                    <div
                      key={trip.id}
                      className="bg-white rounded-2xl border border-[#eceff4] hover:border-[#7a28fa] transition-all cursor-pointer"
                    >
                      <TripCard
                        trip={trip}
                        isLast={index === displayTrips.length - 1 || true}
                        onClick={() => router.push(`/trips/${trip.id}`)}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl py-16 px-5 text-center mt-5 mx-5">
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
          </div>
        </div>

        <BottomNavigation />
      </div>
    </MobileContainer>
  );
}
