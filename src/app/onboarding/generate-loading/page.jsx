"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { MobileContainer } from "../../../components/layout/MobileContainer";
import { LoadingIndicator } from "../../../components/common/LoadingIndicator";
import { useOnboardingStore } from "../../../store/useOnboardingStore";

// Mock AI Generation Function
const generateMockTrip = (data) => {
  return {
    title: `${data.location} 여행`,
    startDate: data.startDate,
    endDate: data.endDate,
    period: `${data.startDate} - ${data.endDate}`,
    days: [
      {
        day: 1,
        date: "2024-05-01",
        places: [
          {
            id: 1,
            time: "10:00",
            name: "제주 국제공항",
            type: "transport",
            description: "도착 및 렌트카 픽업",
          },
          {
            id: 2,
            time: "12:00",
            name: "자매국수",
            type: "food",
            description: "점심 식사 (고기국수)",
            thumbnail: "🍜",
          },
          {
            id: 3,
            time: "14:00",
            name: "함덕 해수욕장",
            type: "spot",
            description: "에메랄드빛 바다 산책",
            thumbnail: "🏖️",
          },
          {
            id: 4,
            time: "16:00",
            name: "델문도 카페",
            type: "cafe",
            description: "오션뷰 카페에서 휴식",
            thumbnail: "☕",
          },
        ],
      },
      {
        day: 2,
        date: "2024-05-02",
        places: [
          {
            id: 5,
            time: "10:00",
            name: "성산일출봉",
            type: "spot",
            description: "유네스코 세계자연유산 탐방",
            thumbnail: "⛰️",
          },
          {
            id: 6,
            time: "13:00",
            name: "맛나식당",
            type: "food",
            description: "갈치조림 맛집",
            thumbnail: "🐟",
          },
          {
            id: 7,
            time: "15:00",
            name: "섭지코지",
            type: "spot",
            description: "해안 절경 산책",
            thumbnail: "🌅",
          },
        ],
      },
    ],
  };
};

export default function GenerateLoadingPage() {
  const router = useRouter();
  const { travelData, setGeneratedTripData } = useOnboardingStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Ensure date objects are handled if needed, for now just passing mock
      const mockResult = generateMockTrip(travelData);
      setGeneratedTripData(mockResult);
      router.push("/onboarding/result");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, travelData, setGeneratedTripData]);

  return (
    <MobileContainer>
      <LoadingIndicator
        message={`AI가 ${travelData.location || "여행지"} 여행 일정을\n생성하고 있습니다...`}
      />
    </MobileContainer>
  );
}
