"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StepLayout } from "../../../components/common/StepLayout";
import { SelectChipGroup } from "../../../components/common/SelectChip";
import { StepperInput } from "../../../components/common/StepperInput";
import { BottomCTAButton } from "../../../components/common/Button";
import { useOnboardingStore } from "../../../store/useOnboardingStore";

const OPTIONS = [
  { label: "혼자", value: "alone" },
  { label: "연인과", value: "couple" },
  { label: "친구와", value: "friends" },
  { label: "가족과", value: "family" },
  { label: "부모님과", value: "parents" },
  { label: "기타", value: "etc" },
];

export default function CompanionSelectionPage() {
  const router = useRouter();
  const { travelData, setTravelData } = useOnboardingStore();
  const [companions, setCompanions] = useState(
    travelData.companions?.[0] || "",
  );
  const [peopleCount, setPeopleCount] = useState(travelData.peopleCount || 1);

  const shouldShowCounter = () => {
    if (!companions) return false;
    if (companions === "alone") return false;
    if (companions === "couple") return false;
    return true;
  };

  useEffect(() => {
    if (companions === "alone") {
      setPeopleCount(1);
    } else if (companions === "couple") {
      setPeopleCount(2);
    } else if (peopleCount < 2 && companions) {
      if (peopleCount === 1) setPeopleCount(2);
    }
  }, [companions]);

  const handleNext = () => {
    setTravelData({ companions: [companions], peopleCount });
    router.push("/onboarding/transport");
  };

  return (
    <StepLayout
      title="누구와 함께하시나요?"
      onBack={() => router.push("/onboarding/date")}
      footer={
        <BottomCTAButton onClick={handleNext} disabled={!companions}>
          다음
        </BottomCTAButton>
      }
    >
      <SelectChipGroup
        options={OPTIONS}
        selected={companions}
        onChange={setCompanions}
        multi={false}
      />

      {shouldShowCounter() && (
        <div className="mt-8 animate-[fadeIn_0.3s_ease]">
          <p className="text-text-dim mb-3 text-sm text-center">
            총 몇 명이서 가시나요?
          </p>
          <StepperInput
            value={peopleCount}
            onChange={setPeopleCount}
            min={2}
            max={99}
          />
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </StepLayout>
  );
}
