"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { MobileContainer } from "../../../components/layout/MobileContainer";
import { HeaderBackButton } from "../../../components/common/HeaderBackButton";
import { BottomSheet } from "../../../features/trip/BottomSheet";
import { useOnboardingStore } from "../../../store/useOnboardingStore";
import {
  MoreHorizontal,
  Camera,
  Receipt,
  Clock,
  Timer,
  MoreVertical,
  Map as MapIcon,
  Wallet,
  CheckSquare,
  Users,
} from "lucide-react";
import { clsx } from "clsx";

const DetailTabs = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: "schedule", label: "일정", icon: MapIcon },
    { id: "budget", label: "예산", icon: Wallet },
    { id: "checklist", label: "준비물", icon: CheckSquare },
    { id: "companion", label: "동행자", icon: Users },
  ];

  return (
    <div className="flex px-4 py-2 gap-4 border-b border-[#f2f2f7]">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={clsx(
            "text-[15px] font-semibold py-2 border-none bg-none relative cursor-pointer",
            {
              "text-[#111] after:content-[''] after:absolute after:bottom-[-1px] after:left-0 after:right-0 after:h-[2px] after:bg-[#111]":
                activeTab === tab.id,
              "text-[#8e8e93]": activeTab !== tab.id,
            },
          )}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default function TripDetailPage() {
  const params = useParams();
  const tripId = params.tripId;
  const router = useRouter();
  const { myTrips } = useOnboardingStore();

  const trip = useMemo(
    () => myTrips.find((t) => String(t.id) === String(tripId)),
    [myTrips, tripId],
  );

  const [activeTab, setActiveTab] = useState("schedule");
  const [selectedDay, setSelectedDay] = useState(1);
  const [activePlaceIdx, setActivePlaceIdx] = useState(null);
  const [activeSnapIndex, setActiveSnapIndex] = useState(1);

  const mapContainerRef = useRef(null);
  const mapInstance = useRef(null);
  const layerGroupRef = useRef(null);

  const currentDayPlaces = useMemo(
    () => trip?.days?.[selectedDay - 1]?.places || [],
    [trip, selectedDay],
  );

  const dayCount = trip?.days?.length || 1;

  useEffect(() => {
    if (typeof window === "undefined" || !window.L || !mapContainerRef.current)
      return;

    if (!mapInstance.current) {
      mapInstance.current = window.L.map(mapContainerRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([33.450701, 126.570667], 13);

      window.L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        { subdomains: "abcd", maxZoom: 20 },
      ).addTo(mapInstance.current);

      layerGroupRef.current = window.L.layerGroup().addTo(mapInstance.current);
    }

    if (layerGroupRef.current) {
      layerGroupRef.current.clearLayers();
    }

    if (currentDayPlaces.length > 0) {
      const latlngs = [];
      const markers = [];

      currentDayPlaces.forEach((place, idx) => {
        const lat = place.lat || 33.450701 + idx * 0.005;
        const lng = place.lng || 126.570667 + idx * 0.005;
        const pos = [lat, lng];
        latlngs.push(pos);

        const isSelected = idx === activePlaceIdx;
        const numberIcon = window.L.divIcon({
          className: `flex items-center justify-center font-bold text-xs bg-[#8a2be2] text-white border-2 border-white rounded-full shadow-lg ${
            isSelected ? "bg-[#ff3b30] scale-125 z-[1000]" : ""
          }`,
          html: `<span>${idx + 1}</span>`,
          iconSize: isSelected ? [32, 32] : [24, 24],
          iconAnchor: isSelected ? [16, 16] : [12, 12],
        });

        const marker = window.L.marker(pos, { icon: numberIcon }).addTo(
          layerGroupRef.current,
        );

        if (isSelected) {
          marker.bindPopup(`<b>${place.name}</b>`).openPopup();
        }

        markers.push(marker);
      });

      if (latlngs.length > 1) {
        window.L.polyline(latlngs, {
          color: "#8a2be2",
          weight: 3,
          opacity: 0.6,
          dashArray: "5, 10",
        }).addTo(layerGroupRef.current);
      }

      if (activePlaceIdx === null && markers.length > 0) {
        const group = new window.L.featureGroup(markers);
        try {
          mapInstance.current.fitBounds(group.getBounds().pad(0.3));
        } catch (e) {
          // ignore bounds error
        }
      }
    }
  }, [currentDayPlaces, activePlaceIdx]);

  const handlePlaceClick = (idx, place) => {
    setActivePlaceIdx(idx);
    const lat = place.lat || 33.450701 + idx * 0.005;
    const lng = place.lng || 126.570667 + idx * 0.005;
    if (mapInstance.current) {
      mapInstance.current.flyTo([lat, lng], 15, { duration: 1 });
    }
  };

  if (!trip) {
    return (
      <MobileContainer>
        <div className="flex flex-col items-center justify-center h-full gap-4 text-[#8e8e93]">
          <p>여행 정보를 찾을 수 없습니다.</p>
          <button
            onClick={() => router.push("/home")}
            className="text-primary font-bold"
          >
            홈으로 돌아가기
          </button>
        </div>
      </MobileContainer>
    );
  }

  return (
    <MobileContainer>
      <div className="h-screen w-full relative bg-[#f2f2f7] overflow-hidden flex flex-col">
        {/* Full Screen Map */}
        <div
          ref={mapContainerRef}
          className="absolute top-0 left-0 w-full h-full z-[1]"
        />

        {/* Header Elements */}
        <header className="relative flex items-center justify-between px-4 bg-white border-b border-[#f2f2f7] z-[300] h-14">
          <HeaderBackButton onBack={() => router.back()} />
          <h2 className="absolute left-1/2 -translate-x-1/2 text-[17px] font-bold text-[#111] truncate max-w-[60%] pointer-events-none">
            {trip.title}
          </h2>
          <button
            className="w-10 h-10 flex items-center justify-center bg-transparent border-none rounded-full cursor-pointer text-[#111]"
            onClick={() => console.log("Menu Open")}
          >
            <MoreHorizontal size={22} />
          </button>
        </header>

        <div className="absolute right-4 top-[72px] flex flex-col gap-3 z-50 transition-all">
          <button
            className="w-12 h-12 rounded-full bg-white text-[#111] flex items-center justify-center shadow-lg border-none cursor-pointer"
            title="영수증 등록"
            onClick={() => router.push(`/trips/${tripId}/camera/receipt`)}
          >
            <Receipt size={22} />
          </button>
          <button
            className="w-12 h-12 rounded-full bg-white text-[#111] flex items-center justify-center shadow-lg border-none cursor-pointer"
            title="사진 등록"
            onClick={() => router.push(`/trips/${tripId}/camera/photo`)}
          >
            <Camera size={22} />
          </button>
        </div>

        <BottomSheet
          snapPoints={[0.1, 0.5, 0.9]}
          initialSnapIndex={1}
          onSnapChange={setActiveSnapIndex}
          header={
            <div className="border-b border-[#f2f2f7] bg-white">
              {activeSnapIndex !== 0 && (
                <DetailTabs activeTab={activeTab} onTabChange={setActiveTab} />
              )}
              {activeTab === "schedule" && (
                <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide pt-1">
                  {Array.from({ length: dayCount }, (_, i) => i + 1).map(
                    (day) => (
                      <button
                        key={day}
                        className={clsx(
                          "shrink-0 px-4 py-2 rounded-full text-[13px] font-semibold border-none cursor-pointer transition-colors",
                          {
                            "bg-[#111] text-white": selectedDay === day,
                            "bg-[#f2f2f7] text-[#8e8e93]": selectedDay !== day,
                          },
                        )}
                        onClick={() => {
                          setSelectedDay(day);
                          setActivePlaceIdx(null);
                        }}
                      >
                        {day}일차
                      </button>
                    ),
                  )}
                </div>
              )}
            </div>
          }
        >
          {activeSnapIndex !== 0 && activeTab === "schedule" ? (
            <div className="px-4 pb-20 pt-2.5">
              {currentDayPlaces.length > 0 ? (
                currentDayPlaces.map((place, idx) => (
                  <div
                    key={idx}
                    className="flex gap-4 relative cursor-pointer group active:bg-black/5 rounded-xl transition-colors"
                    onClick={() => handlePlaceClick(idx, place)}
                  >
                    <div className="flex flex-col items-center w-7 shrink-0">
                      <div className="w-7 h-7 rounded-full bg-[#8a2be2] text-white text-[13px] font-bold flex items-center justify-center z-[2]">
                        {idx + 1}
                      </div>
                      {idx < currentDayPlaces.length - 1 && (
                        <div className="w-0.5 flex-1 bg-[#f2f2f7] my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div
                        className={clsx(
                          "bg-white rounded-2xl p-4 border border-[#f2f2f7] flex justify-between items-start transition-all",
                          {
                            "border-[#8a2be2] bg-[#f9f5ff]":
                              activePlaceIdx === idx,
                          },
                        )}
                      >
                        <div>
                          <h3 className="text-base font-bold text-[#111] mb-1">
                            {place.name}
                          </h3>
                          <div className="flex gap-3 text-xs text-[#8e8e93]">
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              <span>{place.time || "10:00"}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Timer size={12} />
                              <span>{place.duration || "1시간"}</span>
                            </div>
                          </div>
                        </div>
                        <MoreVertical size={18} color="#C7C7CC" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-[#8e8e93]">
                  <p>등록된 일정이 없습니다.</p>
                </div>
              )}
            </div>
          ) : activeSnapIndex !== 0 ? (
            <div className="text-center py-10 text-[#8e8e93]">
              <p>
                {activeTab === "budget"
                  ? "예산"
                  : activeTab === "checklist"
                    ? "준비물"
                    : "동행자"}{" "}
                기능은 준비 중입니다.
              </p>
            </div>
          ) : null}
        </BottomSheet>
      </div>
    </MobileContainer>
  );
}
