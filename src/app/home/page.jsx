"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function HomePage() {
  const router = useRouter();

  const handleCardClick = () => {
    router.push("/onboarding/result");
  };

  return (
    <div className="w-full min-h-screen bg-white">
      {/* Status Bar */}
      <div className="flex items-center justify-between px-5 pt-3 pb-2">
        <span className="text-[15px] font-semibold tracking-[-0.5px] text-[#111111]">
          9:41
        </span>
        <Image
          src="/icons/status-bar-right.svg"
          alt="status"
          width={66}
          height={11}
          className="w-[66px] h-[11px]"
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-2 pb-6">
        <h1 className="text-[20px] font-bold tracking-[-0.5px] text-[#111111]">
          가보자GO
        </h1>
        <button className="bg-[#111111] text-white px-[14px] py-[10px] rounded-full text-[14px] font-medium">
          AI 일정 생성
        </button>
      </div>

      {/* Main Content */}
      <div className="pb-24">
        {/* Travel Card */}
        <div className="px-5">
          <div
            className="bg-[#eaf1f7] rounded-2xl p-4 mb-6 cursor-pointer"
            onClick={handleCardClick}
          >
            {/* Trip Info */}
            <div className="flex flex-col gap-[5px] mb-[14px]">
              <span className="text-[15px] font-normal tracking-[-0.5px] text-[#6d818f]">
                친구와 함께
              </span>
              <h2 className="text-[22px] font-bold tracking-[-0.5px] text-[#111111]">
                제주도 여행
              </h2>
              <span className="text-[15px] font-normal tracking-[-0.5px] text-[#556574]">
                2026.02.10 ~ 02.14
              </span>
            </div>

            {/* Category Tags */}
            <div className="flex gap-1 mb-[38px]">
              {["자연", "맛집", "카페", "쇼핑"].map((tag) => (
                <span
                  key={tag}
                  className="text-[14px] font-normal text-[#6d818f] px-3 py-1.5 rounded-lg bg-white/40"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Budget Section */}
            <div className="flex flex-col gap-2 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-[15px] font-normal tracking-[-0.5px] text-[#556574]">
                  남은 예산
                </span>
                <span className="text-[15px] font-normal tracking-[-0.5px] text-[#556574]">
                  450,000원 / 500,000원
                </span>
              </div>
              {/* Progress Bar */}
              <div className="relative w-full h-3 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-[#111111] rounded-full"
                  style={{ width: "94%" }}
                />
              </div>
            </div>

            {/* Budget Detail Button */}
            <button className="w-full bg-white rounded-lg py-3 mb-6 text-[14px] font-semibold text-[#556574]">
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
                  width={23}
                  height={23}
                  className="w-[23px] h-[23px]"
                />
                <span className="text-[14px] font-semibold text-[#556574]">
                  지도 보기
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Popular Travel Routes Section */}
        <div className="mb-6 px-5">
          <div className="flex justify-between items-center mb-4">
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
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-5 px-5">
            {[
              {
                img: "/images/jeju-beach.png",
                text: "금릉해변과 카페 맛집 코스",
                width: 120,
              },
              {
                img: "/images/jeju-hill.png",
                text: "제주 오름과 먹방 그리고 좋은 숙소",
                width: 120,
              },
              {
                img: "/images/jeju-forest.png",
                text: "제주 여행지 느낌나는 코스 추천!",
                width: 91,
              },
            ].map((item, index) => (
              <div key={index} className="flex flex-col gap-3 flex-shrink-0">
                <div
                  className="rounded-lg overflow-hidden"
                  style={{ width: `${item.width}px`, height: "120px" }}
                >
                  <Image
                    src={item.img}
                    alt="travel route"
                    width={item.width}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p
                  className="text-[15px] font-medium tracking-[-0.06px] leading-[21px] text-[#111111]"
                  style={{ width: `${item.width}px` }}
                >
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Restaurants Section */}
        <div className="mb-6">
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
          <div className="flex gap-3 overflow-x-auto scrollbar-hide -mx-0 px-5">
            {[
              {
                img: "/images/jeju-beach.png",
                text: "금릉해변과 카페 맛집 코스",
                width: 120,
              },
              {
                img: "/images/jeju-hill.png",
                text: "금릉해변과 카페 맛집 코스",
                width: 120,
              },
              {
                img: "/images/jeju-forest.png",
                text: "금릉해변과 카페 맛집 코스",
                width: 120,
              },
            ].map((item, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden flex-shrink-0"
                style={{ width: `${item.width}px`, height: "120px" }}
              >
                <Image
                  src={item.img}
                  alt="restaurant"
                  width={item.width}
                  height={120}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#f2f4f6]">
        <div className="flex items-start justify-around px-5 pt-3">
          <button className="flex flex-col items-center gap-0.5">
            <Image
              src="/icons/home-active.svg"
              alt="home"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            <span className="text-[11px] font-medium tracking-[-0.28px] text-[#111111]">
              홈
            </span>
          </button>
          <button className="flex flex-col items-center gap-0.5 text-[#abb1b9]">
            <Image
              src="/icons/calendar.svg"
              alt="schedule"
              width={20}
              height={22}
              className="w-5 h-[22px]"
            />
            <span className="text-[11px] font-medium tracking-[-0.28px] text-[#abb1b9]">
              일정
            </span>
          </button>
          <button className="flex flex-col items-center gap-0.5">
            <Image
              src="/icons/location.svg"
              alt="search"
              width={16}
              height={19}
              className="w-4 h-[19px]"
            />
            <span className="text-[11px] font-medium tracking-[-0.28px] text-[#abb1b9]">
              장소 검색
            </span>
          </button>
          <button className="flex flex-col items-center gap-0.5 text-[#abb1b9]">
            <Image
              src="/icons/user.svg"
              alt="mypage"
              width={16}
              height={20}
              className="w-4 h-5"
            />
            <span className="text-[11px] font-medium tracking-[-0.28px] text-[#abb1b9]">
              마이페이지
            </span>
          </button>
        </div>
        <div className="flex justify-center pt-2 pb-1">
          <div className="w-[134px] h-[5px] bg-[#000000] rounded-full" />
        </div>
      </div>

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
