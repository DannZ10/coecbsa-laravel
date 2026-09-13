import { ImageWithFallback } from "@/Components/atoms/ImageWithFallback";

/**
 * The CoE CBSA lockup.
 * - `light` renders the green mark as pure white (for dark grounds).
 * - `chip` wraps it in a light chip.
 */
export function Logo({
  className = "h-9",
  light = false,
  chip = false,
}: {
  className?: string;
  light?: boolean;
  chip?: boolean;
}) {
  const img = (
    <ImageWithFallback
      src="/brand/coe-cbsa.png"
      alt="CoE CBSA, Community-Based Sustainable Agroindustry"
      className={`${className} w-auto object-contain transition-[filter] duration-300 ${light ? "[filter:brightness(0)_invert(1)]" : ""}`}
    />
  );
  if (chip) {
    return <span className="inline-flex items-center rounded-md bg-paper px-2.5 py-1.5">{img}</span>;
  }
  return img;
}
