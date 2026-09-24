import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";

interface LogoProps {
  className?: string;
  height?: number;
  priority?: boolean;
  href?: string;
}

export function Logo({
  className,
  height = 24,
  priority = false,
  href = "/",
}: LogoProps) {
  // viewBox aspect ratio is 956 / 286 ≈ 3.34265
  const width = Math.round(height * (956 / 286));

  const content = (
    <Image
      src="/brand/clanb-logo.svg"
      alt="Clan B"
      width={width}
      height={height}
      priority={priority}
      className={cn("h-auto w-auto object-contain", className)}
      style={{ height: `${height}px`, width: "auto" }}
    />
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      className="inline-flex items-center transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-signal focus-visible:outline-offset-2"
      aria-label="Clan B Home"
    >
      {content}
    </Link>
  );
}
