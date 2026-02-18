"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { BottomNavigation } from "../../components/layout/BottomNavigation";

export default function HomePage() {
  const router = useRouter();

  const handleCardClick = () => {
    router.push("/trips/1");
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-2 pb-6">
        <h1 className="text-[20px] font-bold tracking-[-0.5px] text-[#111111]">
          가보자GO
        </h1>
        <button
          className="bg-[#111111] text-white px-[14px] py-[10px] rounded-full text-[14px] font-medium"
          onClick={() => router.push("/onboarding/location")}
        >
          AI 일정 생성
        </button>
      </div>

      {/* Main Content */}
      <div className="pb-32">
        {/* Travel Card */}
        <div className="px-5">
          <div
            className="bg-[#eaf1f7] rounded-2xl p-4 mb-6 cursor-pointer"
            onClick={handleCardClick}
          >
            {/* Trip Info */}
            <div className="flex flex-col gap-[5px] mb-[10px]">
              <div className="flex justify-between border-b border-[#d1dbe2] pb-3">
                <span className="text-[15px] font-normal tracking-[-0.5px] text-[#6d818f]">
                  친구와 함께
                </span>
                <span className="text-[15px] font-normal tracking-[-0.5px] text-[#6d818f]">
                  2026.02.10 ~ 02.14
                </span>
              </div>
              <h2 className="text-[22px] font-bold tracking-[-0.5px] text-[#111111] pt-3">
                제주도 여행
              </h2>
            </div>

            {/* Category Tags */}
            <div className="flex gap-1 mb-[32px]">
              {["자연", "맛집", "카페", "쇼핑"].map((tag) => (
                <span
                  key={tag}
                  className="text-[14px] font-normal text-[#6d818f] px-3 py-1.5 rounded-lg bg-white/80"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Budget Section */}
            <div className="flex flex-col gap-2 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-[15px] font-normal tracking-[-0.5px] text-[#556574]">
                  남은 예산
                </span>
                <span className="text-[15px] font-normal tracking-[-0.5px] text-[#556574]">
                  <span className="font-semibold">412,000원</span> / 500,000원
                </span>
              </div>
              {/* Progress Bar */}
              <div className="relative w-full h-3 bg-white rounded-full overflow-hidden border border-[#111111]">
                <div
                  className="absolute top-0 left-0 h-full bg-[#111111] rounded-full"
                  style={{ width: "80%" }}
                />
              </div>
            </div>

            {/* Budget Detail Button */}
            <button className="w-full bg-white rounded-md py-3 mb-8 text-[14px] font-semibold text-[#556574]">
              예산 자세히 보기
            </button>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button className="flex-1 flex flex-col items-center gap-2 bg-white rounded-xl border border-[#e5eef4] py-5">
                <Image
                  src="/icons/camera.svg"
                  alt="camera"
                  width={28}
                  height={28}
                  className="w-7 h-7"
                />
                <span className="text-[14px] font-semibold text-[#556574]">
                  사진 등록
                </span>
              </button>
              <button className="flex-1 flex flex-col items-center gap-2 bg-white rounded-xl border border-[#e5eef4] py-5">
                <Image
                  src="/icons/receipt.svg"
                  alt="receipt"
                  width={28}
                  height={28}
                  className="w-7 h-7"
                />
                <span className="text-[14px] font-semibold text-[#556574]">
                  영수증 등록
                </span>
              </button>
              <button className="flex-1 flex flex-col items-center gap-2 bg-white rounded-xl border border-[#e5eef4] py-5">
                <Image
                  src="/icons/map-pin.svg"
                  alt="map"
                  width={28}
                  height={28}
                  className="w-7 h-7"
                />
                <span className="text-[14px] font-semibold text-[#556574]">
                  지도 보기
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Popular Travel Routes Section */}
        <div className="mb-8 mt-12">
          <div className="flex justify-between items-center mb-4 px-5">
            <h2 className="text-[18px] font-bold tracking-[-0.5px] text-[#111111]">
              제주도 인기 여행 코스 TOP10
            </h2>
            <Image
              src="/icons/chevron-right-small.svg"
              alt="arrow"
              width={9}
              height={15}
              className="w-[9px] h-[15px]"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-5">
            {[
              {
                img: "/images/jeju-beach.png",
                text: "금릉해변과 카페 맛집 코스",
                width: 140,
              },
              {
                img: "/images/jeju-hill.png",
                text: "제주 오름과 먹방 그리고 좋은 숙소",
                width: 140,
              },
              {
                img: "/images/jeju-forest.png",
                text: "제주 여행지 느낌나는 코스 추천!",
                width: 140,
              },
              {
                img: "/images/jeju-beach.png",
                text: "해안도로 드라이브 코스",
                width: 140,
              },
              {
                img: "/images/jeju-hill.png",
                text: "한라산 등반 코스",
                width: 140,
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col gap-3 flex-shrink-0">
                <div
                  className="rounded-md overflow-hidden relative"
                  style={{ width: `${item.width}px`, height: "140px" }}
                >
                  <Image
                    src={item.img}
                    alt="travel route"
                    fill
                    className="object-cover"
                  />
                </div>
                <p
                  className="text-[15px] font-medium tracking-[-0.06px] leading-[21px] text-[#111111] line-clamp-2"
                  style={{ width: `${item.width}px` }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Restaurants Section */}
        <div className="mb-6 mt-12">
          <div className="flex justify-between items-center mb-4 px-5">
            <h2 className="text-[18px] font-bold tracking-[-0.5px] text-[#111111]">
              제주도 인기 맛집 리스트
            </h2>
            <Image
              src="/icons/chevron-right-small.svg"
              alt="arrow"
              width={9}
              height={15}
              className="w-[9px] h-[15px]"
            />
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide px-5">
            {[
              {
                img: "/images/jeju-beach.png",
                text: "금릉해변과 카페 맛집 코스",
                width: 140,
              },
              {
                img: "/images/jeju-hill.png",
                text: "제주 오름과 먹방 그리고 좋은 숙소",
                width: 140,
              },
              {
                img: "/images/jeju-forest.png",
                text: "제주 여행지 느낌나는 코스 추천!",
                width: 140,
              },
              {
                img: "/images/jeju-beach.png",
                text: "해안도로 드라이브 코스",
                width: 140,
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col gap-3 flex-shrink-0">
                <div
                  className="rounded-md overflow-hidden relative"
                  style={{ width: `${item.width}px`, height: "140px" }}
                >
                  <Image
                    src={item.img}
                    alt="restaurant"
                    fill
                    className="object-cover"
                  />
                </div>
                <p
                  className="text-[15px] font-medium tracking-[-0.06px] leading-[21px] text-[#111111] line-clamp-2"
                  style={{ width: `${item.width}px` }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
