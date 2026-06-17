import Image from "next/image";

export function Logo({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <Image
      src="/logo/k-mark.png"
      alt=""
      width={200}
      height={200}
      className={`shrink-0 object-contain ${className}`}
      aria-hidden="true"
      unoptimized
      priority
    />
  );
}

export function LogoWordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <Logo className="h-9 w-9" />
      <span className="font-latin text-base font-bold tracking-tight sm:text-lg">
        kamalian<span className="text-accent">.</span>dev
      </span>
    </span>
  );
}
