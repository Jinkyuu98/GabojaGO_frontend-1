import React from "react";

export const MobileContainer = ({ children }) => {
  return (
    <div className="w-full min-h-screen flex justify-center bg-black">
      <div className="w-full max-w-[480px] min-h-screen bg-[#ffffff] text-[#111111] shadow-[0_0_20px_rgba(0,0,0,0.5)] relative flex flex-col overflow-x-hidden">
        {children}
      </div>
    </div>
  );
};
