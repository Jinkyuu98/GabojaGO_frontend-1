"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MobileContainer } from "../../../components/layout/MobileContainer";

const HighlightText = ({ text, keyword }) => {
  if (!keyword.trim()) return <span>{text}</span>;
  const parts = text.split(new RegExp(`(${keyword})`, "gi"));
  return (
    <span>
      {parts.map((part, i) =>
        part.toLowerCase() === keyword.toLowerCase() ? (
          <span key={i} className="text-[#7a28fa]">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </span>
  );
};

export default function SearchInputPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);

  // Mock search results
  const MOCK_PLACES = [
    {
      id: 1,
      name: "제주산방산탄산온천",
      address: "제주특별자치도 서귀포시 안덕면 사계북로 41번길 192",
      category: "온천",
    },
    {
      id: 2,
      name: "산방산",
      address: "제주특별자치도 서귀포시 안덕면 사계리",
      category: "자연",
    },
    {
      id: 3,
      name: "카멜리아 힐",
      address: "제주특별자치도 서귀포시 안덕면 병악로 166",
      category: "테마파크",
    },
    {
      id: 4,
      name: "헬로키티아일랜드",
      address: "제주특별자치도 서귀포시 안덕면 한창로 340",
      category: "박물관",
    },
    {
      id: 5,
      name: "제주신화월드",
      address: "제주특별자치도 서귀포시 안덕면 신화역사로304번길 38",
      category: "리조트",
    },
  ];

  const filteredPlaces = searchQuery.trim()
    ? MOCK_PLACES.filter((place) => place.name.includes(searchQuery))
    : [];

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <MobileContainer>
      <div className="w-full h-screen bg-white flex flex-col">
        {/* Header */}
        <div className="fixed top-0 left-0 right-0 px-6 pt-4 pb-4 flex items-center justify-between bg-white z-10 max-w-[430px] mx-auto">
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
            <h1 className="text-[18px] font-semibold text-[#111111] tracking-[-0.5px]">
              장소 검색
            </h1>
          </div>
        </div>

        {/* Search Input Section */}
        <div className="px-5 py-4 mt-[60px]">
          <div className="flex items-center gap-3 bg-white h-14 px-4 rounded-2xl shadow-[0px_4px_16px_rgba(0,0,0,0.06)] border border-[#f2f4f6]">
            <Image
              src="/icons/location.svg"
              alt="location"
              width={16}
              height={19}
              className="grayscale opacity-60"
            />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="어디로 가고 싶으신가요?"
              className="flex-1 text-[16px] font-medium text-[#111111] placeholder:text-[#abb1b9] outline-none"
            />
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto px-5">
          {searchQuery.trim() && filteredPlaces.length > 0 ? (
            <div className="flex flex-col gap-5 pt-2">
              {filteredPlaces.map((place) => (
                <div
                  key={place.id}
                  className="flex flex-col gap-1 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-[16px] font-semibold text-[#111111]">
                      <HighlightText text={place.name} keyword={searchQuery} />
                    </h3>
                    <span className="text-[12px] font-medium text-[#7a28fa] bg-[#f9f5ff] px-2 py-0.5 rounded">
                      {place.category}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#898989] line-clamp-1">
                    {place.address}
                  </p>
                  <div className="h-[1px] bg-[#f2f4f6] mt-4" />
                </div>
              ))}
            </div>
          ) : searchQuery.trim() ? (
            <div className="flex flex-col items-center justify-center pt-20 text-[#abb1b9]">
              <p className="text-[15px] font-medium">검색 결과가 없습니다.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 pt-4">
              <h2 className="text-[15px] font-bold text-[#111111]">
                최근 검색어
              </h2>
              <div className="flex flex-col gap-4">
                <p className="text-[14px] text-[#abb1b9]">
                  최근 검색어가 없습니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MobileContainer>
  );
}
