"use client";

import { useRouter, useSearchParams } from "next/navigation";

/**
 * A select that navigates to a filtered URL on change.
 * Uses URL search params so filtered views remain shareable and crawlable.
 */
export function FilterSelect({
  param,
  options,
  placeholder,
  value,
  id,
}: {
  param: string;
  options: { value: string; label: string }[];
  placeholder: string;
  value: string;
  id: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const params = new URLSearchParams(searchParams.toString());
    const v = e.target.value;
    if (v) params.set(param, v);
    else params.delete(param);
    router.push(`/projects/?${params.toString()}`);
  }

  return (
    <select
      id={id}
      className="field-select py-2 text-sm"
      defaultValue={value}
      onChange={onChange}
      aria-label={placeholder}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
