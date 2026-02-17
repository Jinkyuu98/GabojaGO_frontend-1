import React from "react";

export const TextInput = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  autoFocus = false,
}) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-sm text-text-dim ml-1">{label}</label>}
      <input
        type={type}
        className="w-full p-4 bg-[#f5f5f7] rounded-xl text-[#111111] text-base border border-transparent transition-all duration-200 focus:border-[#111111] focus:bg-white placeholder-[#999999] outline-none"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
      />
    </div>
  );
};
