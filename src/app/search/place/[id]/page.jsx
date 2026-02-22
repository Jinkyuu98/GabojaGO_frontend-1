"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import { MobileContainer } from "../../../../components/layout/MobileContainer";
import { registerPlace } from "../../../../services/place";

/**
 * [ADD] SearchPlaceDetailPage
 * 검색 결과에서 장소를 선택했을 때 나타나는 상세 페이지입니다.
 * 상단 헤더, 지도 배경 및 마커, 하단 바텀시트로 구성됩니다.
 */
export default function SearchPlaceDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  const [placeData, setPlaceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // [ADD] 바텀시트 드래그 상태 관리
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const startY = useRef(0);
  const sheetRef = useRef(null);

  // [ADD] 로컬 스토리지에서 실제 데이터 불러오기 (place_ID 키 활용)
  useEffect(() => {
    const savedData = localStorage.getItem(`place_${id}`);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setPlaceData(parsed);

        // [ADD] 이미 찜한 장소인지 확인
        const savedList = JSON.parse(
          localStorage.getItem("saved_places") || "[]",
        );
        const exists = savedList.some(
          (p) => String(p.id) === String(parsed.id),
        );
        setIsSaved(exists);
      } catch (e) {
        console.error("Failed to parse saved place data", e);
      }
    }
    setIsLoading(false);
  }, [id]);

  // [ADD] 지도 초기화 및 마커 표시
  const initMap = () => {
    if (!window.kakao || !mapRef.current) return;

    window.kakao.maps.load(() => {
      const position = new window.kakao.maps.LatLng(
        placeData.latitude,
        placeData.longitude,
      );

      // 지도 생성
      if (!mapInstance.current) {
        mapInstance.current = new window.kakao.maps.Map(mapRef.current, {
          center: position,
          level: 3,
        });
      } else {
        mapInstance.current.setCenter(position);
      }

      const map = mapInstance.current;

      // [MOD] 바텀시트 높이를 고려하여 지도를 아래로 이동시켜 마커를 위로 올림
      map.panBy(0, 150);

      // 마커 표시
      const marker = new window.kakao.maps.Marker({
        position: position,
      });
      marker.setMap(map);

      // 커스텀 오버레이 (장소명)
      const content = `
        <div class="mt-10 bg-black/80 backdrop-blur-md px-2 py-0 rounded-[6px] border border-white/20 shadow-lg">
          <span class="text-white text-[13px] font-medium whitespace-nowrap">
            ${placeData.name}
          </span>
        </div>
      `;

      const customOverlay = new window.kakao.maps.CustomOverlay({
        position: position,
        content: content,
        yAnchor: 0.5,
      });
      customOverlay.setMap(map);
    });
  };

  useEffect(() => {
    if (window.kakao && placeData) {
      initMap();
    }
  }, [placeData]);

  if (!placeData) {
    return (
      <MobileContainer>
        <div className="w-full h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
          {isLoading ? (
            <p className="text-[#abb1b9] animate-pulse">
              정보를 불러오는 중...
            </p>
          ) : (
            <>
              <p className="text-[#abb1b9] mb-4">
                장소 정보를 찾을 수 없습니다.
              </p>
              <button
                onClick={() => router.back()}
                className="px-6 py-2 bg-[#111111] text-white rounded-xl font-bold"
              >
                뒤로가기
              </button>
            </>
          )}
        </div>
      </MobileContainer>
    );
  }

  // [ADD] 터치 이벤트 핸들러
  const handleTouchStart = (e) => {
    startY.current = e.touches[0].clientY;
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentY = e.touches[0].clientY;
    const deltaY = currentY - startY.current;

    // [MOD] 드래그 범위 조정: 최소화 상태에서도 핸들이 보이도록 제한
    // 시트가 약간만 보이게 하기 위해 최대 250px 정도로 제한 (전체 높이가 약 300px 가정)
    if (isMinimized) {
      const newY = Math.min(Math.max(deltaY + 250, 0), 300);
      setDragY(newY);
    } else {
      const newY = Math.max(deltaY, 0);
      setDragY(newY);
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    // [MOD] 임계값 및 고정 위치 조정 - 최소화 상태에서도 핸들이 충분히 보이도록 함
    // (바텀시트의 콘텐츠 일부와 핸들이 함께 노출됨)
    if (dragY > 100) {
      setIsMinimized(true);
      setDragY(220); // 시트 높이에 따라 조절 (핸들이 화면 하단에서 약 80px 정도 노출되게)
    } else {
      setIsMinimized(false);
      setDragY(0); // 완전히 올린 상태
    }
  };

  return (
    <MobileContainer>
      <Script
        src="//dapi.kakao.com/v2/maps/sdk.js?appkey=57dd33d25e0269c9c37a3ea70b3a3b4f&autoload=false&libraries=services"
        strategy="afterInteractive"
        onLoad={initMap}
      />
      <div className="relative w-full h-screen bg-white overflow-hidden">
        {/* [ADD] 상단 헤더 섹션: 뒤로가기 버튼 및 장소명 */}
        <div className="fixed top-0 left-0 right-0 px-6 pt-4 pb-4 flex items-center bg-white z-30 shadow-sm">
          <button
            onClick={() => router.back()}
            className="p-1 -ml-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <Image
              src="/icons/arrow-left.svg"
              alt="back"
              width={20}
              height={16}
              className="w-5 h-4"
            />
          </button>
          <h1 className="ml-4 text-[18px] font-semibold text-[#111111] tracking-[-0.5px]">
            {placeData.name}
          </h1>
        </div>

        {/* [MOD] 지도 영역 (실제 카카오맵 연결) */}
        <div className="absolute inset-0 w-full h-full z-10 pt-[60px]">
          <div ref={mapRef} className="w-full h-full" />
        </div>

        {/* [ADD] 하단 바텀시트 섹션 */}
        <div
          ref={sheetRef}
          className={`absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-[32px] shadow-[0_-12px_40px_rgba(0,0,0,0.12)] px-5 pt-10 pb-10 max-w-[430px] mx-auto transition-transform ${isDragging ? "" : "duration-300 ease-out"}`}
          style={{ transform: `translateY(${dragY}px)` }}
        >
          {/* [MOD] 드래그 핸들: 시인성 강화 (두께, 색상, 높이 조정) */}
          <div
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            className="absolute top-0 left-0 right-0 h-10 flex items-start justify-center cursor-grab active:cursor-grabbing pt-3"
          >
            <div className="w-12 h-1.5 bg-[#d1d5db] rounded-full shadow-inner" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-[20px] font-bold text-[#111111] tracking-[-0.8px]">
                    {placeData.name}
                  </h2>
                  <span className="text-[12px] font-semibold text-[#7a28fa] bg-[#f9f5ff] px-2 py-0.5 rounded">
                    {placeData.category}
                  </span>
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  <p className="text-[14px] text-[#6e6e6e] tracking-[-0.3px] leading-relaxed">
                    {placeData.address}
                  </p>
                  <div className="flex items-center gap-1">
                    <span className="text-[13px] font-bold text-[#7a28fa]">
                      ★ {placeData.rating}
                    </span>
                    <span className="text-[13px] text-[#abb1b9]">
                      ({placeData.reviewCount})
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* [ADD] 상세보기 및 찜하기 버튼 */}
            <div className="flex flex-col gap-2 mt-4">
              <button
                onClick={() => router.push(`/search/place/${id}/detail`)}
                className="w-full h-[56px] border border-[#111111] text-[#111111] rounded-2xl text-[16px] font-bold hover:bg-gray-50 active:scale-[0.98] transition-all"
              >
                상세보기
              </button>
              {!isSaved && (
                <button
                  onClick={async () => {
                    try {
                      // [ADD] 장소 등록 API 호출 (PC 버전과 동일하게 개별 예외 처리)
                      try {
                        await registerPlace({
                          id: placeData.id,
                          name: placeData.name,
                          address: placeData.address,
                          category: placeData.category,
                          latitude: placeData.latitude,
                          longitude: placeData.longitude,
                          phone: placeData.phone,
                          link: placeData.link,
                        });
                      } catch (e) {
                        console.error(
                          "API registration failed, using local storage fallback:",
                          e,
                        );
                      }

                      // [ADD] 로컬 스토리지 저장 (API 실패 여부와 상관없이 수행되어야 함)
                      const savedList = JSON.parse(
                        localStorage.getItem("saved_places") || "[]",
                      );
                      if (
                        !savedList.find(
                          (p) => String(p.id) === String(placeData.id),
                        )
                      ) {
                        savedList.push(placeData);
                        localStorage.setItem(
                          "saved_places",
                          JSON.stringify(savedList),
                        );
                      }

                      router.push("/search?saved=true");
                    } catch (error) {
                      console.error("Local save failed:", error);
                      router.push("/search?saved=true");
                    }
                  }}
                  className="w-full h-[56px] bg-[#111111] text-white rounded-2xl text-[16px] font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
                >
                  찜한 장소로 등록하기
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}
