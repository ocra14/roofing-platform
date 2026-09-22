import type { SVGProps } from "react";

type IconName =
  | "wrench" | "home" | "search" | "bolt" | "siren" | "building" | "calendar"
  | "droplet" | "layer" | "metal" | "grid" | "square" | "phone" | "check"
  | "arrow-right" | "star" | "menu" | "close" | "chevron-down" | "map-pin"
  | "clock" | "mail" | "shield" | "badge" | "quote" | "send" | "play"
  | "facebook" | "instagram" | "youtube" | "linkedin" | "x" | "alert"
  | "file" | "user" | "chart" | "logout" | "settings" | "image" | "link"
  | "plus" | "edit" | "trash" | "eye" | "download" | "filter" | "calendar-check"
  | "palette" | "save" | "search-circle" | "tag" | "bell";

const PATHS: Record<IconName, string> = {
  wrench: "M14.7 6.3a4 4 0 0 0 5 5l3-3-5-5-3 3a4 4 0 0 0-5 5l-7 7 3 3 7-7a4 4 0 0 0 4-4z",
  home: "M3 11l9-8 9 8M5 10v10h14V10",
  search: "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM20 20l-4.3-4.3",
  bolt: "M13 2 4 14h6l-1 8 9-12h-6l1-8z",
  siren: "M12 3a5 5 0 0 0-5 5v4l-2 6h14l-2-6V8a5 5 0 0 0-5-5zM9 20a3 3 0 0 0 6 0",
  building: "M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2",
  calendar: "M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16H4zM4 9h16M9 3v4M15 3v4",
  droplet: "M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z",
  layer: "M12 3 3 8l9 5 9-5-9-5zM3 13l9 5 9-5",
  metal: "M3 8h18M3 12h18M3 16h18M7 4v16M17 4v16",
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  square: "M4 4h16v16H4z",
  phone: "M5 3h4l2 5-3 2a12 12 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z",
  check: "M4 12l5 5L20 6",
  "arrow-right": "M5 12h14M13 6l6 6-6 6",
  star: "M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 20.9l1.1-6.5L2.6 9.8l6.5-.9z",
  menu: "M4 6h16M4 12h16M4 18h16",
  close: "M6 6l12 12M18 6L6 18",
  "chevron-down": "M6 9l6 6 6-6",
  "map-pin": "M12 21s7-6 7-11a7 7 0 1 0-14 0c0 5 7 11 7 11zM12 12a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3.5 2",
  mail: "M3 5h18v14H3zM3 7l9 6 9-6",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6l8-3z",
  badge: "M12 3l3 3h4v4l3 3-3 3v4h-4l-3 3-3-3H6v-4l-3-3 3-3V6h4z",
  quote: "M7 7h4v6a4 4 0 0 1-4 4M13 7h4v6a4 4 0 0 1-4 4",
  send: "M22 3 11 14M22 3l-7 19-4-8-8-4 19-7z",
  play: "M8 5v14l11-7z",
  facebook: "M14 9h3V5h-3a4 4 0 0 0-4 4v3H7v4h3v6h4v-6h3l1-4h-4V9a1 1 0 0 1 1-1z",
  instagram: "M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM17 6h.01",
  youtube: "M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3V8zM10 9l5 3-5 3z",
  linkedin: "M5 9h3v10H5zM6 5a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM10 9h3v1.5a4 4 0 0 1 7 2.5V19h-3v-5a2 2 0 0 0-4 0v5h-3z",
  x: "M4 4l16 16M20 4L4 20",
  alert: "M12 3 2 20h20L12 3zM12 9v5M12 17h.01",
  file: "M6 2h8l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zM14 2v5h5",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 20a8 8 0 0 1 16 0",
  chart: "M4 20V10M10 20V4M16 20v-6M22 20H2",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  settings: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12a7 7 0 0 0-.2-1.7l2-1.6-2-3.4-2.4 1a7 7 0 0 0-3-1.7L13 2h-4l-.4 2.6a7 7 0 0 0-3 1.7l-2.4-1-2 3.4 2 1.6A7 7 0 0 0 3 12c0 .6.1 1.2.2 1.7l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 3 1.7L9 22h4l.4-2.6a7 7 0 0 0 3-1.7l2.4 1 2-3.4-2-1.6c.1-.5.2-1.1.2-1.7z",
  image: "M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6",
  link: "M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1.5 1.5M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1.5-1.5",
  plus: "M12 5v14M5 12h14",
  edit: "M4 20h4L20 8l-4-4L4 16v4z",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
  eye: "M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  download: "M12 3v12M7 10l5 5 5-5M4 20h16",
  filter: "M3 5h18l-7 8v6l-4-2v-4z",
  "calendar-check": "M4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16H4zM4 9h16M9 3v4M15 3v4M9 15l2 2 4-4",
  palette: "M12 3a9 9 0 1 0 0 18 1.5 1.5 0 0 0 1.2-2.4c-.5-.7-.2-1.6.6-1.6H18a3 3 0 0 0 3-3 9 9 0 0 0-9-9zM7.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM12 8a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zM16.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z",
  save: "M5 4h11l3 3v13H5zM8 4v6h8V4M8 20v-6h8v6",
  "search-circle": "M11 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14zM20 20l-4.3-4.3",
  tag: "M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9zM7.5 7.5h.01",
  bell: "M18 15V10a6 6 0 1 0-12 0v5l-2 3h16l-2-3zM9.5 21a2.5 2.5 0 0 0 5 0",
};

export type { IconName };

export function Icon({
  name,
  className,
  size = 20,
  strokeWidth = 1.75,
  ...props
}: SVGProps<SVGSVGElement> & { name: IconName; size?: number }) {
  const d = PATHS[name as IconName];
  if (!d) return null;
  return (
    <svg
      role="img"
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d={d} />
    </svg>
  );
}
