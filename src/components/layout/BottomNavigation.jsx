"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Map, Heart, Clock, User } from "lucide-react";
import { useOnboardingStore } from "../../store/useOnboardingStore";
import { clsx } from "clsx";

export const BottomNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { myTrips } = useOnboardingStore();

  const NAV_ITEMS = [
    { label: "홈", path: "/home", icon: Home },
    { label: "내 여행", path: "/trips", icon: Map },
    { label: "찜", path: "/saved", icon: Heart }, // Placeholder
    { label: "기록", path: "/history", icon: Clock }, // Placeholder
    { label: "마이", path: "/profile", icon: User }, // Placeholder
  ];

  return (
    <nav className="absolute bottom-0 left-0 w-full h-[80px] bg-[#f2f2f7] flex justify-around items-center pb-5 z-[1000] backdrop-blur-md bg-opacity-95 border-t border-[#aeaeb2]/20">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname.startsWith(item.path);
        const Icon = item.icon;

        return (
          <button
            key={item.path}
            className="flex flex-col items-center justify-center w-12 h-12 bg-transparent border-none cursor-pointer"
            onClick={() => router.push(item.path)}
          >
            <Icon
              size={24}
              className={clsx("mb-1 transition-colors duration-200", {
                "text-[#111111]": isActive,
                "text-[#aeaeb2]": !isActive,
              })}
              strokeWidth={isActive ? 2.5 : 2}
            />
            <span
              className={clsx(
                "text-[10px] font-medium transition-colors duration-200",
                {
                  "text-[#111111]": isActive,
                  "text-[#aeaeb2]": !isActive,
                },
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
