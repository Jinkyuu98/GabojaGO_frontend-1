"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MobileContainer } from "../../components/layout/MobileContainer";
import { BottomNavigation } from "../../components/layout/BottomNavigation";
import { clsx } from "clsx";
import { getSavedPlaces } from "../../services/place";
import { useEffect, useRef } from "react";
import Script from "next/script";

export default function MyPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("장소"); // "장소" 또는 "사진"
  const [savedPlaces, setSavedPlaces] = useState([]); // [ADD] 실제 등록된 장소 데이터를 위한 상태 추가
  const [isLoading, setIsLoading] = useState(false);
  const [sortBy, setSortBy] = useState("latest"); // [ADD] 정렬 상태 (latest, reviews, oldest)
  const [selectedCategory, setSelectedCategory] = useState("전체"); // [ADD] 카테고리 필터 상태

  // [ADD] PC 전용 모달 상태
  const [selectedPlaceForModal, setSelectedPlaceForModal] = useState(null);
  const modalMapRef = useRef(null);
  const modalMapInstance = useRef(null);

  const user = {
    name: "홍길동님",
    reviewCount: 12,
    profileImage: "/icons/profile.svg", // Using existing profile icon as placeholder
  };

  const tabs = [
    { id: "장소", label: "찜/등록된 장소" },
    { id: "사진", label: "찜한 사진" },
  ];

  useEffect(() => {
    if (activeTab === "장소") {
      const fetchSavedPlaces = async () => {
        setIsLoading(true);
        try {
          // 1. 로컬 스토리지에서 먼저 가져오기
          const localData = JSON.parse(
            localStorage.getItem("saved_places") || "[]",
          );

          // 2. API에서도 가져오기
          let apiData = [];
          try {
            const response = await getSavedPlaces();
            if (response.data) {
              const rawData = response.data;
              apiData = Array.isArray(rawData)
                ? rawData
                : typeof rawData === "object"
                  ? Object.values(rawData)
                  : [];

              apiData = apiData.map((item) => ({
                id: item.id,
                name: item.name,
                address: item.address,
                category: item.group_name || item.category || "장소",
                latitude: parseFloat(item.latitude),
                longitude: parseFloat(item.longitude),
                rating: item.rating || 0,
                reviewCount: item.review_count || item.reviewCount || 0,
              }));
            }
          } catch (e) {
            console.error("API fetch failed, using local data only:", e);
          }

          // 3. 중복 제거 후 합치기 (ID 기준)
          const merged = [...localData];
          apiData.forEach((item) => {
            if (!merged.find((m) => String(m.id) === String(item.id))) {
              merged.push(item);
            }
          });

          // [ADD] 정렬 로직 적용
          const sorted = [...merged].sort((a, b) => {
            if (sortBy === "reviews") {
              return (b.reviewCount || 0) - (a.reviewCount || 0);
            } else if (sortBy === "oldest") {
              // ID가 커지는 순서 (등록순 가정)
              return parseInt(a.id) - parseInt(b.id);
            } else {
              // latest: ID가 작아지는 순서 (최신등록 가정)
              return parseInt(b.id) - parseInt(a.id);
            }
          });

          setSavedPlaces(sorted);
        } catch (error) {
          console.error("Failed to fetch saved places:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchSavedPlaces();
    }
  }, [activeTab, sortBy]);

  const savedPhotos = [{ id: 6, src: "/images/trip-photo-3.png" }];

  // [ADD] 카테고리 필터링이 적용된 리스트 계산
  const filteredPlaces = useMemo(() => {
    if (selectedCategory === "전체") return savedPlaces;
    return savedPlaces.filter((place) => place.category === selectedCategory);
  }, [savedPlaces, selectedCategory]);

  useEffect(() => {
    if (selectedPlaceForModal && window.kakao) {
      window.kakao.maps.load(() => {
        const position = new window.kakao.maps.LatLng(
          selectedPlaceForModal.latitude,
          selectedPlaceForModal.longitude,
        );

        if (!modalMapInstance.current) {
          modalMapInstance.current = new window.kakao.maps.Map(
            modalMapRef.current,
            {
              center: position,
              level: 3,
            },
          );

          // 마커 추가
          const marker = new window.kakao.maps.Marker({ position });
          marker.setMap(modalMapInstance.current);
        } else {
          modalMapInstance.current.setCenter(position);
          modalMapInstance.current.relayout();
        }
      });
    } else {
      modalMapInstance.current = null;
    }
  }, [selectedPlaceForModal]);

  return (
    <MobileContainer showNav={true}>
      <Script
        src="//dapi.kakao.com/v2/maps/sdk.js?appkey=57dd33d25e0269c9c37a3ea70b3a3b4f&autoload=false&libraries=services"
        strategy="afterInteractive"
      />
      <div className="w-full h-screen bg-white flex flex-col lg:bg-[#f8f9fa]">
        <header className="flex items-center justify-between px-5 py-6 bg-white sticky top-0 z-10 lg:border-b lg:border-[#f2f4f6]">
          <div className="max-w-[800px] w-full mx-auto flex items-center justify-between">
            <h1 className="text-[20px] lg:text-[24px] font-bold text-[#111] tracking-tighter">
              마이페이지
            </h1>
            <button className="hidden lg:block text-sm font-semibold text-[#7a28fa] border border-[#7a28fa] px-4 py-2 rounded-lg">
              프로필 수정
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto w-full pb-32">
          <div className="max-w-[800px] w-full mx-auto">
            {/* Profile Section */}
            <div className="px-5 pt-8 pb-6 lg:bg-white lg:rounded-3xl lg:mt-6 lg:shadow-sm">
              <div className="flex items-center gap-6 mb-2">
                <div className="w-20 h-20 bg-[#f2f4f6] rounded-full flex items-center justify-center border border-[#eceff4]">
                  <Image
                    src={user.profileImage}
                    alt="profile"
                    width={40}
                    height={50}
                    className="grayscale opacity-40"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <h1 className="text-[24px] font-bold text-[#111111] tracking-[-0.5px]">
                    {user.name}
                  </h1>
                  <div className="flex items-center gap-1 cursor-pointer group">
                    <span className="text-[15px] font-medium text-[#556574] group-hover:text-[#7a28fa] transition-colors">
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
            <div className="flex border-b border-[#f2f4f6] px-5 bg-white lg:mt-6 lg:rounded-t-3xl lg:border-b-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={clsx(
                    "flex-1 py-4 text-[16px] font-bold tracking-[-0.3px] transition-all relative",
                    activeTab === tab.id ? "text-[#111111]" : "text-[#abb1b9]",
                  )}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#111111]" />
                  )}
                </button>
              ))}
            </div>

            {/* Content Area */}
            <div className="bg-[#fafafa] lg:bg-white px-5 py-8 lg:rounded-b-3xl min-h-[400px]">
              {activeTab === "장소" ? (
                <div className="flex flex-col gap-6">
                  {/* [ADD] 카테고리 필터 버튼 UI (검색 결과 페이지와 동일한 스타일) */}
                  <div className="flex overflow-x-auto gap-2 scrollbar-hide pb-2 -mx-1 px-1">
                    {[
                      "전체",
                      "음식점",
                      "카페",
                      "버스정류장",
                      "숙소",
                      "주유소",
                    ].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={clsx(
                          "whitespace-nowrap px-4 py-2 rounded-full text-[14px] font-semibold transition-all border",
                          selectedCategory === cat
                            ? "bg-[#111111] text-white border-[#111111]"
                            : "bg-white text-[#111111] border-[#DBDBDB] hover:bg-gray-50",
                        )}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* [ADD] 정렬 옵션 선택 UI (카테고리 하단 정렬) */}
                  <div className="flex items-center gap-4 py-1">
                    {[
                      { id: "latest", label: "최신순" },
                      { id: "reviews", label: "리뷰순" },
                      { id: "oldest", label: "과거순" },
                    ].map((option) => (
                      <button
                        key={option.id}
                        onClick={() => setSortBy(option.id)}
                        className={clsx(
                          "text-[14px] font-bold transition-colors",
                          sortBy === option.id
                            ? "text-[#111111]"
                            : "text-[#abb1b9] hover:text-[#556574]",
                        )}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-4 mt-2">
                    {isLoading ? (
                      <div className="flex flex-col items-center justify-center py-20 text-[#abb1b9]">
                        <p className="text-[16px] font-medium animate-pulse">
                          장소를 불러오는 중...
                        </p>
                      </div>
                    ) : (
                      <>
                        {filteredPlaces.map((place) => (
                          <div
                            key={place.id}
                            onClick={() => {
                              if (window.innerWidth >= 1024) {
                                setSelectedPlaceForModal(place);
                              } else {
                                localStorage.setItem(
                                  `place_${place.id}`,
                                  JSON.stringify(place),
                                );
                                router.push(`/search/place/${place.id}`);
                              }
                            }}
                            className="bg-white lg:bg-[#f9fafb] rounded-2xl border border-[#eceff4] p-5 shadow-[0px_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-shadow cursor-pointer"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-[17px] font-bold text-[#111111]">
                                {place.name}
                              </h3>
                              <span className="text-[13px] font-bold text-[#7a28fa] bg-[#f8f6ff] px-3 py-1 rounded-full">
                                {place.category}
                              </span>
                            </div>
                            <div className="flex flex-col gap-1.5">
                              <p className="text-[14px] text-[#6d818f] line-clamp-1">
                                {place.address}
                              </p>
                              <div className="flex items-center gap-1.5">
                                <span className="text-[13px] font-bold text-[#7a28fa] flex items-center gap-0.5">
                                  ★ {place.rating || 0}
                                </span>
                                <span className="text-[13px] text-[#abb1b9]">
                                  ({place.reviewCount || 0})
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                        {filteredPlaces.length === 0 && (
                          <div className="flex flex-col items-center justify-center py-20 text-[#abb1b9]">
                            <p className="text-[16px] font-medium">
                              해당 카테고리의 찜한 장소가 없습니다.
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2 lg:gap-3">
                  {savedPhotos.map((photo) => (
                    <div
                      key={photo.id}
                      className="relative aspect-square rounded-xl overflow-hidden group"
                    >
                      <Image
                        src={photo.src}
                        alt="saved-photo"
                        fill
                        className="object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                  ))}
                  {savedPhotos.length === 0 && (
                    <div className="col-span-3 flex flex-col items-center justify-center py-20 text-[#abb1b9]">
                      <p className="text-[16px] font-medium">
                        찜한 사진이 없습니다.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>

      {/* [ADD] PC 전용 상세 정보 모달 */}
      {selectedPlaceForModal && (
        <div className="hidden lg:flex fixed inset-0 z-[100] items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-[600px] rounded-[32px] overflow-hidden shadow-2xl flex flex-col animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="p-8 pb-4 flex flex-col gap-2">
              <div className="flex flex-col gap-1.5 items-start">
                <span className="text-[13px] font-bold text-[#7a28fa] bg-[#f8f6ff] px-3 py-1 rounded-full">
                  {selectedPlaceForModal.category}
                </span>
                <h2 className="text-[28px] font-bold text-[#111111] tracking-tight">
                  {selectedPlaceForModal.name}
                </h2>
              </div>
              <p className="text-[16px] text-[#6d818f]">
                {selectedPlaceForModal.address}
              </p>
            </div>

            {/* Map Area */}
            <div className="flex-1 min-h-[300px] relative">
              <div
                ref={modalMapRef}
                className="absolute inset-0 w-full h-full"
              />
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0px_0px_40px_rgba(0,0,0,0.05)]" />
            </div>

            {/* Modal Footer */}
            <div className="p-8 flex items-center justify-between bg-[#fbfbfc]">
              <button
                onClick={() => {
                  localStorage.setItem(
                    `place_${selectedPlaceForModal.id}`,
                    JSON.stringify(selectedPlaceForModal),
                  );
                  router.push(`/search?select=${selectedPlaceForModal.id}`);
                }}
                className="h-[56px] px-8 bg-[#7a28fa] text-white rounded-2xl text-[16px] font-bold hover:bg-[#6922d5] transition-colors shadow-lg shadow-[#7a28fa]/20 active:scale-95 transition-all"
              >
                상세보기
              </button>
              <button
                onClick={() => setSelectedPlaceForModal(null)}
                className="h-[56px] px-8 border border-[#eceff4] bg-white text-[#6d818f] rounded-2xl text-[16px] font-bold hover:bg-gray-50 active:scale-95 transition-all"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </MobileContainer>
  );
}
