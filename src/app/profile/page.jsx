"use client";

import React, { useState } from "react";
import Image from "next/image";
import { MobileContainer } from "../../components/layout/MobileContainer";
import { BottomNavigation } from "../../components/layout/BottomNavigation";
import { clsx } from "clsx";

export default function MyPage() {
  const [activeTab, setActiveTab] = useState("장소"); // "장소" 또는 "사진"

  const user = {
    name: "홍길동님",
    reviewCount: 12,
    profileImage: "/icons/profile.svg", // Using existing profile icon as placeholder
  };

  const tabs = [
    { id: "장소", label: "찜/등록된 장소" },
    { id: "사진", label: "찜한 사진" },
  ];

  // Mock data for places and photos
  const savedPlaces = [
    {
      id: 1,
      name: "제주산방산탄산온천",
      address: "제주특별자치도 서귀포시 안덕면 사계북로 41번길 192",
      category: "온천",
    },
    {
      id: 2,
      name: "카멜리아 힐",
      address: "제주특별자치도 서귀포시 안덕면 병악로 166",
      category: "테마파크",
    },
  ];

  const savedPhotos = [
    { id: 1, src: "/images/trip-photo-1.png" },
    { id: 2, src: "/images/trip-photo-2.png" },
    { id: 3, src: "/images/trip-photo-3.png" },
    { id: 4, src: "/images/trip-photo-1.png" },
    { id: 5, src: "/images/trip-photo-2.png" },
    { id: 6, src: "/images/trip-photo-3.png" },
  ];

  return (
    <MobileContainer>
      <div className="w-full h-screen bg-white flex flex-col">
        <header className="flex items-center justify-between px-5 py-4 backdrop-blur-md sticky top-0 z-10">
          <h1 className="text-[20px] font-semibold text-[#111] tracking-tighter">
            마이페이지
          </h1>
        </header>
        {/* Profile Section */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-[#f2f4f6] rounded-full flex items-center justify-center border border-[#eceff4]">
              <Image
                src={user.profileImage}
                alt="profile"
                width={32}
                height={40}
                className="grayscale opacity-40"
              />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-[20px] font-bold text-[#111111] tracking-[-0.5px]">
                {user.name}
              </h1>
              <div className="flex items-center gap-1">
                <span className="text-[14px] font-medium text-[#424242] inline-block w-fit">
                  내 리뷰 {user.reviewCount}개
                </span>
                <Image
                  src="/icons/arrow-right.svg"
                  alt="arrow-right"
                  width={16}
                  height={16}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#f2f4f6] px-5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "flex-1 py-3.5 text-[15px] font-semibold tracking-[-0.3px] transition-all relative",
                activeTab === tab.id ? "text-[#111111]" : "text-[#abb1b9]",
              )}
            >
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[2px] bg-[#111111]" />
              )}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto bg-[#fafafa] px-5 py-6 pb-32">
          {activeTab === "장소" ? (
            <div className="flex flex-col gap-2">
              {savedPlaces.map((place) => (
                <div
                  key={place.id}
                  className="bg-white rounded-2xl border border-[#eceff4] p-4 shadow-[0px_2px_8px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[16px] font-bold text-[#111111]">
                      {place.name}
                    </h3>
                    <span className="text-[12px] font-medium text-[#7a28fa]">
                      {place.category}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#898989] line-clamp-1">
                    {place.address}
                  </p>
                </div>
              ))}
              {savedPlaces.length === 0 && (
                <div className="flex flex-col items-center justify-center pt-20 text-[#abb1b9]">
                  <p className="text-[15px] font-medium">
                    찜한 장소가 없습니다.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-[2px] -mx-5 px-5">
              {savedPhotos.map((photo) => (
                <div key={photo.id} className="relative aspect-square">
                  <Image
                    src={photo.src}
                    alt="saved-photo"
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
              {savedPhotos.length === 0 && (
                <div className="col-span-3 flex flex-col items-center justify-center pt-20 text-[#abb1b9]">
                  <p className="text-[15px] font-medium">
                    찜한 사진이 없습니다.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
    </MobileContainer>
  );
}
