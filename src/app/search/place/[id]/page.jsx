"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Script from "next/script";
import { MobileContainer } from "../../../../components/layout/MobileContainer";

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

  const [placeData, setPlaceData] = useState({
    name: "장소 정보",
    category: "...",
    address: "주소를 불러오는 중입니다",
    rating: 0,
    reviewCount: 0,
    latitude: 37.5665,
    longitude: 126.978,
  });

  // [ADD] 로컬 스토리지에서 실제 데이터 불러오기
  useEffect(() => {
    const savedData = localStorage.getItem(`place_${id}`);
    if (savedData) {
      try {
        setPlaceData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved place data", e);
      }
    }
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
    if (window.kakao) {
      initMap();
    }
  }, [placeData]);

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
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-white rounded-t-[24px] shadow-[0_-8px_30px_rgba(0,0,0,0.08)] px-5 pt-8 pb-10 max-w-[430px] mx-auto">
          {/* 드래그 핸들 (시각용) */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1 bg-[#e5ebf2] rounded-full" />

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
              <button
                onClick={() => {
                  // [MOD] Instead of AlertDialog, move to search page with param to show toast
                  router.push("/search?saved=true");
                }}
                className="w-full h-[56px] bg-[#111111] text-white rounded-2xl text-[16px] font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
              >
                찜한 장소로 등록하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </MobileContainer>
  );
}
