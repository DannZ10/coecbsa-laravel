type IconName = "map" | "phone" | "mail" | "instagram";

const paths: Record<IconName, React.ReactNode> = {
  map: (
    <>
      <path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Z" />
      <circle cx="12" cy="11" r="2" />
    </>
  ),
  phone: (
    <path d="M17.472 14.382a10.9 10.9 0 0 1-5.848-5.854l1.293-1.293a1 1 0 0 0 .24-1.02l-1-3A1 1 0 0 0 11.2 2.5H7.5a1 1 0 0 0-1 1A14 14 0 0 0 20.5 17.5a1 1 0 0 0 1-1v-3.7a1 1 0 0 0-.715-.957l-3-1a1 1 0 0 0-1.02.24Z" />
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" />
    </>
  ),
};

export function Icon({ name, className = "h-4 w-4" }: { name: IconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {paths[name]}
    </svg>
  );
}
