"use client";

import Select, { ClassNamesConfig, GroupBase } from "react-select";
import CreatableSelect from "react-select/creatable";

export interface SelectOption {
  value: string;
  label: string;
}

interface FilterSelectProps {
  instanceId: string;
  options: SelectOption[];
  value: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  /** Allow typing arbitrary values not present in `options` (used for free-form tags). */
  creatable?: boolean;
  isLoading?: boolean;
}

const optionState = (isSelected: boolean, isFocused: boolean) => {
  if (isSelected) return "bg-primary text-on-primary";
  if (isFocused) return "bg-surface-container-highest text-on-surface";
  return "text-on-surface";
};

// Theme-aware styling via Tailwind design tokens so the control follows light/dark mode.
const classNames: ClassNamesConfig<SelectOption, true, GroupBase<SelectOption>> = {
  control: ({ isFocused }) =>
    `bg-surface-container-high rounded-lg min-h-[42px] px-1 text-sm border transition-colors ${
      isFocused ? "border-primary ring-2 ring-primary/20" : "border-transparent"
    }`,
  valueContainer: () => "px-2 gap-1 flex flex-wrap py-1",
  placeholder: () => "text-on-surface-variant",
  input: () => "text-on-surface",
  singleValue: () => "text-on-surface",
  menu: () =>
    "bg-surface-container-high rounded-lg mt-1 shadow-lg overflow-hidden z-30 border border-outline-variant",
  menuList: () => "py-1 max-h-60",
  option: ({ isFocused, isSelected }) =>
    `px-3 py-2 text-sm cursor-pointer ${optionState(isSelected, isFocused)}`,
  multiValue: () => "bg-primary/10 rounded-md overflow-hidden",
  multiValueLabel: () => "text-primary text-xs font-semibold px-1.5 py-0.5 capitalize",
  multiValueRemove: () =>
    "text-primary hover:bg-primary/20 px-1 flex items-center cursor-pointer",
  noOptionsMessage: () => "text-on-surface-variant text-sm py-2 px-3",
  loadingMessage: () => "text-on-surface-variant text-sm py-2 px-3",
  dropdownIndicator: () => "text-on-surface-variant px-1.5 hover:text-on-surface",
  clearIndicator: () => "text-on-surface-variant px-1 hover:text-on-surface cursor-pointer",
  indicatorSeparator: () => "bg-outline-variant my-1.5",
};

function FilterSelect({
  instanceId,
  options,
  value,
  onChange,
  placeholder,
  creatable,
  isLoading,
}: Readonly<FilterSelectProps>) {
  const selected = value.map(
    (v) => options.find((o) => o.value === v) ?? { value: v, label: v }
  );

  const Component = creatable ? CreatableSelect : Select;

  return (
    <Component
      instanceId={instanceId}
      inputId={`${instanceId}-input`}
      isMulti
      unstyled
      options={options}
      value={selected}
      onChange={(opts) => onChange(opts.map((o) => o.value))}
      placeholder={placeholder}
      isLoading={isLoading}
      classNames={classNames}
      // Created values are sent as typed; the backend normalizes tag case when matching.
      formatCreateLabel={(input) => `Add "${input}"`}
      noOptionsMessage={() => "No matches"}
    />
  );
}

export default FilterSelect;
