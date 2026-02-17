import React from "react";
import { clsx } from "clsx";

export const SelectChip = ({ label, selected, onClick, multi = false }) => {
  return (
    <button
      type="button"
      className={clsx(
        "px-5 py-3 rounded-full border border-surface bg-surface text-text-dim text-base font-medium transition-all duration-200 whitespace-nowrap hover:border-text",
        {
          "bg-primary text-bg border-primary font-semibold": selected,
        },
      )}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export const SelectChipGroup = ({
  options,
  selected,
  onChange,
  multi = false,
}) => {
  const handleSelect = (value) => {
    if (multi) {
      const newSelected = selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value];
      onChange(newSelected);
    } else {
      onChange(value);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <SelectChip
          key={option.value}
          label={option.label}
          selected={
            multi ? selected.includes(option.value) : selected === option.value
          }
          onClick={() => handleSelect(option.value)}
        />
      ))}
    </div>
  );
};
