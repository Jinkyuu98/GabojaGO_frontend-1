"use client";

import React from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { clsx } from "clsx";

export const SideNavigation = () => {
  const router = useRouter();
  const pathname = usePathname();

  const NAV_ITEMS = [
    {
      label: "홈",
      path: "/home",
      icon: "/icons/home-active.svg",
      width: 24,
      height: 24,
    },
    {
      label: "일정",
      path: "/trips",
      icon: "/icons/calendar.svg",
      width: 24,
      height: 24,
    },
    {
      label: "장소 검색",
      path: "/search",
      icon: "/icons/location.svg",
      width: 26,
      height: 26,
    },
    {
      label: "마이페이지",
      path: "/profile",
      icon: "/icons/user.svg",
      width: 20,
      height: 20,
    },
  ];

  return (
    <div className="hidden lg:flex flex-col w-[100px] h-screen bg-white border-r border-[#f2f4f6] sticky top-0 left-0 py-8 px-2 z-50">
      <nav className="flex flex-col gap-6">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.path;

          return (
            <button
              key={item.path}
              className={clsx(
                "flex flex-col items-center justify-center gap-2 px-1 py-4 rounded-2xl transition-all w-full",
                isActive
                  ? "bg-[#f8f6ff] text-[#7a28fa]"
                  : "bg-transparent text-[#556574] hover:bg-[#f5f7f9]",
              )}
              onClick={() => router.push(item.path)}
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={24}
                height={24}
                className={clsx("transition-all", {
                  "grayscale-0 opacity-100": isActive,
                  "grayscale opacity-40": !isActive,
                })}
              />
              <span className="text-[12px] font-bold tracking-[-0.4px] text-center whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
